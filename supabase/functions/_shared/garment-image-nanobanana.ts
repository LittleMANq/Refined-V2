import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

import type {
  GarmentImageProvider,
  GarmentImageRequest,
  GarmentImageResult,
  GarmentImageSource,
  GarmentImageTags,
  GarmentRegion,
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
 * Person handling: Gemini blocks generating images derived from a recognizable
 * person (finishReason IMAGE_OTHER) when a face/head is in the crop, which is the
 * common selfie/full-body case for tops. So we try the detected crop first, and if
 * it is blocked we retry with the crop tightened to drop the head/neck, leaving only
 * garment fabric, which passes. Both attempts share one 30s budget.
 *
 * The Gemini key lives ONLY in the edge secret GEMINI_API_KEY, never on the client.
 * On any failure (block, error, or timeout) the caller stays graceful ("needs
 * details"). Swappable: a different image engine just implements
 * GarmentImageProvider, no caller changes.
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
    'The attached image shows a single clothing garment. It may be worn by a person (for example a selfie or a full-body photo where the garment is on someone).',
    'Extract ONLY that garment, the one the person is wearing, and render it by itself as a clean e-commerce catalog product photo, as if the garment were photographed alone.',
    'Remove the person entirely: no person, no face, no skin, no hair, no hands or any body parts, and none of the original background.',
    'Place the isolated garment on a neutral, seamless light-grey studio background, centered and framed as a vertical 3:4 portrait. No other items, no hanger, no props, no text.',
    'Reproduce the garment faithfully: preserve its exact color, pattern, material, shape, cut and details. Do NOT change it, do NOT substitute a different item, do NOT invent or add details.',
    'If the garment is partly hidden or unclear, stay faithful to what is actually visible rather than guessing or inventing.',
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
async function garmentInline(
  source: GarmentImageSource,
  region: GarmentRegion | undefined,
): Promise<{ data: string; mimeType: string }> {
  try {
    const cropped = await cropper.produce({ source, region });
    return { data: cropped.base64, mimeType: cropped.mediaType };
  } catch {
    return inlineSource(source);
  }
}

/**
 * Tighten a region to drop the head / neck (the top portion) and a little of the
 * sides, leaving mostly garment fabric. Used only as a fallback when Gemini blocks
 * a crop that still contains a recognizable person (people-generation policy).
 */
function tightenRegion(r: GarmentRegion): GarmentRegion {
  const dropTop = r.height * 0.35;
  const insetX = r.width * 0.08;
  return {
    x: Math.min(0.98, r.x + insetX),
    y: Math.min(0.98, r.y + dropTop),
    width: Math.max(0.04, r.width - insetX * 2),
    height: Math.max(0.04, r.height - dropTop),
  };
}

/** Crop attempts, best (full garment) first, then a face-excluding tighter crop. */
function candidateRegions(region: GarmentRegion | undefined): (GarmentRegion | undefined)[] {
  if (!region) return [undefined];
  return [region, tightenRegion(region)];
}

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
  inline_data?: { mime_type?: string; data?: string };
};

/**
 * One Gemini image call. Returns the generated image, or null when Gemini returned
 * NO image (an empty / policy-blocked response) so the caller can retry a tighter
 * crop. Throws on an HTTP error or timeout.
 */
async function callGemini(
  prompt: string,
  data: string,
  mimeType: string,
  budgetMs: number,
): Promise<GarmentImageResult | null> {
  const body = {
    contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data } }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1000, budgetMs));
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
      throw new Error('Gemini image generation timed out');
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
  return null; // no image (e.g. people-policy block); the caller may retry a tighter crop
}

export class NanoBananaImageProvider implements GarmentImageProvider {
  readonly id = 'nano-banana';

  async produce(request: GarmentImageRequest): Promise<GarmentImageResult> {
    const deadline = Date.now() + TIMEOUT_MS;
    const prompt = buildPrompt(request.tags);

    // Try the detected crop first; if Gemini returns no image (a person/face block),
    // retry with the crop tightened to drop the head and neck. One shared 30s budget.
    for (const region of candidateRegions(request.region)) {
      const remaining = deadline - Date.now();
      if (remaining <= 1500) break;
      const { data, mimeType } = await garmentInline(request.source, region);
      const result = await callGemini(prompt, data, mimeType, remaining);
      if (result) return result;
    }
    throw new Error('Gemini returned no image');
  }
}
