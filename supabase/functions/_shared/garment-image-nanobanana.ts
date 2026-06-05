import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

import type {
  GarmentImageProvider,
  GarmentImageRequest,
  GarmentImageResult,
  GarmentImageSource,
  GarmentImageTags,
} from '../../../lib/analysis/types.ts';
import { CropGarmentImageProvider } from './garment-image-crop.ts';

/**
 * The active GarmentImageProvider: generates a clean, catalog-style product image
 * of the detected garment with Google's Gemini image model ("Nano Banana").
 *
 * Fidelity first: the source photo is CROPPED to the detected bounding_region so
 * exactly ONE garment is sent to Gemini (no guessing which item), and the prompt is
 * reproduction-first (reproduce the pictured garment faithfully; the tags are a
 * hint only, the image is the source of truth). A single garment on a seamless
 * neutral background, framed 3:4, comes back.
 *
 * The Gemini key lives ONLY in the edge secret GEMINI_API_KEY, never on the client.
 * A timeout guards against a slow generation hanging the add; on any failure the
 * caller stays graceful ("needs details").
 *
 * Swappable: a different image engine just implements GarmentImageProvider, no
 * caller changes.
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

/**
 * Reproduction-first prompt: the cropped image is the source of truth, the model
 * must reproduce the pictured garment faithfully, never substitute or invent. The
 * tag is only a soft hint and the image wins on any conflict.
 */
function buildPrompt(tags?: GarmentImageTags): string {
  const hint = [tags?.color, tags?.type].filter(Boolean).join(' ').trim() || tags?.label || '';
  return [
    'Reproduce the exact garment shown in this image as a clean catalog product photo on a neutral, seamless light-grey background, framed as a vertical 3:4 portrait.',
    'Preserve its exact color, pattern, material, shape and details. Do NOT change the garment, do NOT substitute a different item, do NOT invent or add details.',
    'Show only this one garment: no person, no body parts, no other items, no hanger, no props, no text.',
    'If the garment is unclear, stay faithful to what is actually visible rather than guessing or inventing.',
    hint
      ? `It looks like a ${hint}, but that is only a hint; the image is the source of truth, and if they ever conflict, follow the image.`
      : '',
    'Use soft, even studio lighting with a gentle natural shadow, photorealistic.',
  ]
    .filter(Boolean)
    .join(' ');
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

// Reuse the verified crop (PNG/JPEG decode + region crop). Kept off the active
// upload path; here it isolates the single garment BEFORE handing it to Gemini.
const cropper = new CropGarmentImageProvider();

/**
 * The image actually sent to Gemini: the source CROPPED to the detected region, so
 * only the chosen garment is in frame and the model cannot guess a different item.
 * If the crop fails (e.g. an undecodable source), fall back to the whole image so
 * generation still proceeds.
 */
async function garmentInline(request: GarmentImageRequest): Promise<{ data: string; mimeType: string }> {
  try {
    const cropped = await cropper.produce({ source: request.source, region: request.region });
    return { data: cropped.base64, mimeType: cropped.mediaType };
  } catch {
    return inlineSource(request.source);
  }
}

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
  inline_data?: { mime_type?: string; data?: string };
};

export class NanoBananaImageProvider implements GarmentImageProvider {
  readonly id = 'nano-banana';

  async produce(request: GarmentImageRequest): Promise<GarmentImageResult> {
    const { data, mimeType } = await garmentInline(request);
    const prompt = buildPrompt(request.tags);

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
