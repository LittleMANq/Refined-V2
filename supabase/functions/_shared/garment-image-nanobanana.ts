import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

import type {
  GarmentImageProvider,
  GarmentImageRequest,
  GarmentImageResult,
  GarmentImageSource,
  GarmentImageTags,
  GarmentRegion,
} from '../../../lib/analysis/types.ts';

/**
 * The active GarmentImageProvider: generates a clean, catalog-style product image
 * of the detected garment with Google's Gemini image model ("Nano Banana").
 *
 * The garment photo + its detected tags (type/color) go in; a single garment on a
 * seamless neutral background, framed 3:4, comes back. The Gemini key lives ONLY in
 * the edge secret GEMINI_API_KEY, never on the client. A timeout guards against a
 * slow generation hanging the add; on any failure the caller stays graceful.
 *
 * Swappable: a different image engine just implements GarmentImageProvider, no
 * caller changes (the crop provider in garment-image-crop.ts is kept as a fallback).
 */

const MODEL = Deno.env.get('GEMINI_IMAGE_MODEL') ?? 'gemini-2.5-flash-image';
const API_BASE = Deno.env.get('GEMINI_API_BASE') ?? 'https://generativelanguage.googleapis.com/v1beta';
const TIMEOUT_MS = Number(Deno.env.get('GEMINI_TIMEOUT_MS') ?? '30000');

function apiKey(): string {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error('GEMINI_API_KEY is not set in the function environment');
  return key;
}

/** Strip a `data:<type>;base64,` prefix if the caller sent a data URL. */
function stripDataUrl(base64: string): string {
  const marker = 'base64,';
  const i = base64.indexOf(marker);
  return i >= 0 ? base64.slice(i + marker.length) : base64;
}

/** A light positional hint so the right garment is chosen when several are present. */
function positionHint(region?: GarmentRegion): string {
  if (!region) return '';
  const cx = region.x + region.width / 2;
  const cy = region.y + region.height / 2;
  const vert = cy < 0.34 ? 'upper' : cy > 0.66 ? 'lower' : 'middle';
  const horiz = cx < 0.34 ? 'left' : cx > 0.66 ? 'right' : 'center';
  return ` (it appears in the ${vert} ${horiz} area of the photo)`;
}

function buildPrompt(tags?: GarmentImageTags, region?: GarmentRegion): string {
  const desc = [tags?.color, tags?.type].filter(Boolean).join(' ').trim() || tags?.label || 'single garment';
  return [
    `Create a clean, catalog-style e-commerce product photo of ONLY the ${desc} shown in the attached image${positionHint(region)}.`,
    `Isolate that one garment on a seamless, neutral light-grey studio background.`,
    `Remove the person and any body parts, and remove every other garment, hanger, prop, logo overlay and text.`,
    `Keep the garment's true color, fabric texture, pattern and details faithful to the original photo.`,
    `Use soft even studio lighting with a gentle natural shadow, photorealistic.`,
    `Center the garment and frame it as a vertical 3:4 portrait product shot.`,
  ].join(' ');
}

async function inlineSource(source: GarmentImageSource): Promise<{ data: string; mimeType: string }> {
  if (source.base64) return { data: stripDataUrl(source.base64), mimeType: source.mediaType ?? 'image/jpeg' };
  if (source.url) {
    const res = await fetch(source.url);
    if (!res.ok) throw new Error(`Failed to fetch source image: ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    return { data: encodeBase64(bytes), mimeType: res.headers.get('content-type') ?? 'image/jpeg' };
  }
  throw new Error('source must include base64 or url');
}

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
  inline_data?: { mime_type?: string; data?: string };
};

export class NanoBananaImageProvider implements GarmentImageProvider {
  readonly id = 'nano-banana';

  async produce(request: GarmentImageRequest): Promise<GarmentImageResult> {
    const { data, mimeType } = await inlineSource(request.source);
    const prompt = buildPrompt(request.tags, request.region);

    const body = {
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data } }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    };

    // Timeout so a slow generation never hangs the add (the caller degrades gracefully).
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/models/${MODEL}:generateContent`, {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Gemini image generation timed out after ${TIMEOUT_MS}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Gemini image generation failed: ${res.status} ${detail.slice(0, 300)}`);
    }

    const json = await res.json();
    const parts: GeminiPart[] = json?.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      const inline = part.inlineData ?? part.inline_data;
      if (inline?.data) {
        const outMime = (inline as { mimeType?: string; mime_type?: string }).mimeType
          ?? (inline as { mime_type?: string }).mime_type
          ?? 'image/png';
        return { base64: inline.data, mediaType: outMime };
      }
    }
    throw new Error('Gemini returned no image');
  }
}
