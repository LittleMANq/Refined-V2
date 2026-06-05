import * as jpeg from 'npm:jpeg-js@0.4.4';
import UPNG from 'npm:upng-js@2.1.0';
import { decodeBase64, encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

import type {
  GarmentImageProvider,
  GarmentImageRequest,
  GarmentImageResult,
  GarmentImageSource,
  GarmentRegion,
} from '../../../lib/analysis/types.ts';

/**
 * The MVP GarmentImageProvider: a focused CROP to the garment's region. No
 * background removal yet, that is a FUTURE upgrade (a segmentation / cutout
 * provider implements this same interface and swaps in with zero caller changes).
 *
 * Pure geometry, no API key: decode the source to RGBA, copy the normalized
 * region's pixels into a smaller buffer, re-encode JPEG. Accepts PNG and JPEG (the
 * web picker yields PNG, the camera yields JPEG); output is always JPEG so the slot
 * renders one consistent format. Pure-JS (jpeg-js + upng-js, no WASM, no native),
 * so it runs server-side and the app needs no native image lib.
 */

/** Strip a `data:<type>;base64,` prefix if the caller sent a data URL. */
function stripDataUrl(base64: string): string {
  const marker = 'base64,';
  const i = base64.indexOf(marker);
  return i >= 0 ? base64.slice(i + marker.length) : base64;
}

async function sourceBytes(source: GarmentImageSource): Promise<Uint8Array> {
  if (source.base64) return decodeBase64(stripDataUrl(source.base64));
  if (source.url) {
    const res = await fetch(source.url);
    if (!res.ok) throw new Error(`Failed to fetch source image: ${res.status}`);
    return new Uint8Array(await res.arrayBuffer());
  }
  throw new Error('source must include base64 or url');
}

type RawImage = { width: number; height: number; data: Uint8Array };

const isPng = (b: Uint8Array): boolean =>
  b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
const isJpeg = (b: Uint8Array): boolean =>
  b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;

/** Decode PNG or JPEG bytes to packed RGBA (4 bytes/pixel). Throws on anything else. */
function decodeToRgba(bytes: Uint8Array): RawImage {
  if (isPng(bytes)) {
    const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    const png = UPNG.decode(ab);
    const frame = UPNG.toRGBA8(png)[0]; // ArrayBuffer of RGBA for the first frame
    return { width: png.width, height: png.height, data: new Uint8Array(frame) };
  }
  if (isJpeg(bytes)) {
    const d = jpeg.decode(bytes, { useTArray: true });
    return { width: d.width, height: d.height, data: d.data };
  }
  throw new Error('Unsupported image format (expected PNG or JPEG)');
}

/** Convert a normalized region to a valid pixel box inside the WxH image. */
function pixelBox(region: GarmentRegion | undefined, W: number, H: number) {
  const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);
  const r = region ?? { x: 0, y: 0, width: 1, height: 1 };
  let x = clamp01(r.x);
  let y = clamp01(r.y);
  let w = clamp01(r.width);
  let h = clamp01(r.height);
  if (w <= 0) w = 1 - x;
  if (h <= 0) h = 1 - y;
  if (x + w > 1) w = 1 - x;
  if (y + h > 1) h = 1 - y;

  const px = Math.min(W - 1, Math.max(0, Math.round(x * W)));
  const py = Math.min(H - 1, Math.max(0, Math.round(y * H)));
  let pw = Math.max(1, Math.round(w * W));
  let ph = Math.max(1, Math.round(h * H));
  if (px + pw > W) pw = W - px;
  if (py + ph > H) ph = H - py;
  return { px, py, pw, ph };
}

export class CropGarmentImageProvider implements GarmentImageProvider {
  readonly id = 'crop';

  async produce(request: GarmentImageRequest): Promise<GarmentImageResult> {
    const bytes = await sourceBytes(request.source);
    const { width: W, height: H, data: src } = decodeToRgba(bytes); // RGBA, 4 bytes/pixel

    const { px, py, pw, ph } = pixelBox(request.region, W, H);

    // Copy the region's rows into a tightly-packed RGBA buffer.
    const cropped = new Uint8Array(pw * ph * 4);
    for (let row = 0; row < ph; row++) {
      const srcStart = ((py + row) * W + px) * 4;
      cropped.set(src.subarray(srcStart, srcStart + pw * 4), row * pw * 4);
    }

    const out = jpeg.encode({ data: cropped, width: pw, height: ph }, 82);
    return { base64: encodeBase64(out.data), mediaType: 'image/jpeg' };
  }
}
