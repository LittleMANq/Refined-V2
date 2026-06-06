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
 * Two goals, equally hard:
 *
 * 1. CONSISTENCY. Every garment, of every type, from every kind of source photo,
 *    must come back with the SAME treatment: one garment, centered, on the same
 *    seamless neutral light background, the same 3:4 framing and scale, the same
 *    soft contact shadow, no person, no original background. The prompt nails down
 *    every one of those variables as hard rules so a closet grid reads uniform.
 *
 * 2. ROBUST PERSON REMOVAL. The common input is a person WEARING the garment (a
 *    selfie or full-body shot). Gemini blocks generating an image derived from a
 *    recognizable person (finishReason IMAGE_OTHER) when a face/head is in frame,
 *    and even when it does generate it can leak the wearer's torso/skin. We defend
 *    on three fronts: (a) the source is CROPPED to the detected region so only the
 *    garment is sent; (b) if a crop is blocked or leaks, we retry with the crop
 *    progressively tightened to drop the head/neck, and the prompt tells the model
 *    to RECONSTRUCT the full garment as a standalone product even from a partial
 *    crop; (c) we re-check the OUTPUT with a vision pass and, if a person is still
 *    visible, retry tighter or fall back. A garment that never comes back clean
 *    throws, so the caller stays graceful ("needs details"), never a person-in-frame.
 *
 * The Gemini key lives ONLY in the edge secret GEMINI_API_KEY, never on the client.
 * Swappable: a different image engine just implements GarmentImageProvider, no
 * caller changes. Used by BOTH closet-add and onboarding via the one shared
 * `generate-garment-image` endpoint, so every piece gets the same treatment.
 */

const MODEL = Deno.env.get('GEMINI_IMAGE_MODEL') ?? 'gemini-2.5-flash-image';
// A text+vision model used only to re-check the OUTPUT for a leaked person. Same
// key and base; defaults to a fast flash model so the extra call is cheap.
const VISION_MODEL = Deno.env.get('GEMINI_VISION_MODEL') ?? 'gemini-2.5-flash';
const API_BASE = Deno.env.get('GEMINI_API_BASE') ?? 'https://generativelanguage.googleapis.com/v1beta';
const TIMEOUT_MS = Number(Deno.env.get('GEMINI_TIMEOUT_MS') ?? '55000');
// Ask the image model for a portrait 3:4 canvas so the stored asset matches the
// 3:4 garment slot and every image has the same shape and scale. Set to '' to let
// the model choose (some model versions ignore imageConfig).
const ASPECT_RATIO = Deno.env.get('GEMINI_ASPECT_RATIO') ?? '3:4';
// Set GEMINI_VERIFY_OUTPUT=0 to skip the output person-check (still fully safe via
// the crop + prompt defenses); on by default.
const VERIFY_OUTPUT = (Deno.env.get('GEMINI_VERIFY_OUTPUT') ?? '1') !== '0';

// Don't start a generation with less than this left; don't run the verify pass
// with less than this left (instead, accept the image we already have).
const GEN_MIN_MS = 8000;
const VERIFY_MIN_MS = 4000;

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
 * The reproduction-first, consistency-locked prompt. The cropped image is the
 * source of truth (reproduce the pictured garment faithfully, never substitute or
 * invent), the tag is a soft hint only, and EVERY other variable, background,
 * framing, scale, lighting, shadow, presentation, is fixed so the output is uniform
 * across all garment types. Person removal and full-garment reconstruction are hard
 * rules so a partial, worn-on-a-person crop still yields a clean standalone product.
 */
function buildPrompt(tags?: GarmentImageTags): string {
  const hint = [tags?.color, tags?.type].filter(Boolean).join(' ').trim() || tags?.label || '';
  return [
    // What the input is, and the one thing to extract.
    'The attached image shows a single clothing garment. It is often worn by a person (a selfie or a full-body photo), and the crop may be partial.',
    'Extract ONLY that one garment and render it by itself as a clean e-commerce catalog product photo, exactly as a premium online store would shoot every product the same way.',
    // Hard person + background removal.
    'Remove the person and the setting completely: no person, no face, no skin, no hair, no hands, no body or body parts, no mannequin, no hanger, no props, no text, and none of the original background.',
    // Full-garment reconstruction from a partial crop.
    'If the garment is cropped, partly hidden, or only partly visible, reconstruct it as ONE complete, whole standalone product, plausibly completing the hidden parts (collar, shoulders, sleeves, hem, waistband) in the same exact fabric, color and pattern. Show the entire garment, not a fragment.',
    // The fixed presentation, identical for every garment.
    'Presentation, identical for every garment: show the garment front-facing, upright, symmetric and gently filled out as if worn by an invisible body (ghost-mannequin look), keeping its natural shape, with no body visible.',
    // The fixed background, identical for every garment.
    'Background, identical for every garment: a seamless, perfectly even, very light neutral warm-grey studio backdrop. The exact same flat tone edge to edge: no gradient, no vignette, no darker corners, no visible floor or wall seam, no colored cast.',
    // The fixed framing and scale, identical for every garment.
    'Framing, identical for every garment: a vertical 3:4 portrait. Center the garment horizontally and vertically. It should fill about 82 percent of the frame height, with even empty margin on all sides, at the same scale every time so a grid of these images looks uniform.',
    // The fixed lighting and shadow, identical for every garment.
    'Lighting and shadow, identical for every garment: soft, even, frontal studio light with a neutral white balance, and one subtle soft contact shadow directly beneath the garment. No hard shadows, no long shadows, no dramatic lighting.',
    // Fidelity.
    'Reproduce the garment faithfully: preserve its exact color, pattern, material, shape, cut and details. Do NOT change it, do NOT substitute a different item, do NOT invent or add details. If something is unclear, stay faithful to what is actually visible rather than guessing.',
    hint
      ? `It looks like a ${hint}, but that is only a hint; the image is the source of truth, and if they ever conflict, follow the image.`
      : '',
    'Photorealistic, high resolution.',
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
 * The image actually sent to Gemini: the source CROPPED to the given region, so
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
 * Tighten a region by dropping its top portion (the head / neck) and insetting the
 * sides, leaving mostly garment fabric. Used to retry when a crop is blocked or the
 * output still leaks a person. `dropTop`/`inset` are fractions of the region.
 */
function tightenRegion(r: GarmentRegion, dropTop: number, inset: number): GarmentRegion {
  const dy = r.height * dropTop;
  const dx = r.width * inset;
  return {
    x: Math.min(0.98, r.x + dx),
    y: Math.min(0.98, r.y + dy),
    width: Math.max(0.04, r.width - dx * 2),
    height: Math.max(0.04, r.height - dy),
  };
}

/**
 * Crop attempts, best (full garment) first, then progressively tighter crops that
 * drop more of the top so a recognizable head/face is excluded while leaving enough
 * fabric for the model to reconstruct the whole garment.
 */
function candidateRegions(region: GarmentRegion | undefined): (GarmentRegion | undefined)[] {
  if (!region) return [undefined];
  return [region, tightenRegion(region, 0.25, 0.07), tightenRegion(region, 0.45, 0.12)];
}

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
  inline_data?: { mime_type?: string; data?: string };
};

/** POST to a Gemini model (image or vision) with a JSON body, honoring a time budget. */
async function geminiFetch(
  model: string,
  body: unknown,
  budgetMs: number,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(1000, budgetMs));
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': apiKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Gemini request timed out');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini request failed: ${res.status} ${detail.slice(0, 300)}`);
  }
  return await res.json();
}

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
  const generationConfig: Record<string, unknown> = { responseModalities: ['IMAGE'] };
  if (ASPECT_RATIO) generationConfig.imageConfig = { aspectRatio: ASPECT_RATIO };
  const body = {
    contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data } }] }],
    generationConfig,
  };
  const json = (await geminiFetch(MODEL, body, budgetMs)) as {
    candidates?: { content?: { parts?: GeminiPart[] } }[];
  };
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

/**
 * Re-check the GENERATED image for a leaked person. Returns:
 *  - 'clean'   the image shows only the garment, no human,
 *  - 'person'  a human face/skin/body part is visible (retry tighter or fall back),
 *  - 'unknown' the check could not run (error/timeout/budget): don't block on it.
 * Best-effort: any failure resolves to 'unknown' so a flaky check never discards a
 * good image.
 */
async function verifyNoPerson(
  image: GarmentImageResult,
  budgetMs: number,
): Promise<'clean' | 'person' | 'unknown'> {
  const prompt =
    'This is a product photo. Does it contain any visible human being: a human face, head, skin, hair, hands, or any body part? Ignore the clothing itself, clothing is expected. Answer with exactly one word: PERSON if any human body part is visible, otherwise CLEAN.';
  const body = {
    contents: [
      { parts: [{ text: prompt }, { inline_data: { mime_type: image.mediaType, data: image.base64 } }] },
    ],
    // Disable "thinking" so the one-word verdict isn't eaten by reasoning tokens.
    generationConfig: { temperature: 0, maxOutputTokens: 16, thinkingConfig: { thinkingBudget: 0 } },
  };
  try {
    const json = (await geminiFetch(VISION_MODEL, body, budgetMs)) as {
      candidates?: { content?: { parts?: GeminiPart[] } }[];
    };
    const parts: GeminiPart[] = json?.candidates?.[0]?.content?.parts ?? [];
    const text = parts.map((p) => p.text ?? '').join(' ').toUpperCase();
    if (text.includes('PERSON')) return 'person';
    if (text.includes('CLEAN')) return 'clean';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export class NanoBananaImageProvider implements GarmentImageProvider {
  readonly id = 'nano-banana';

  async produce(request: GarmentImageRequest): Promise<GarmentImageResult> {
    const deadline = Date.now() + TIMEOUT_MS;
    const prompt = buildPrompt(request.tags);
    const regions = candidateRegions(request.region);

    // Try the detected crop first; on a policy block (no image) or a person leaked
    // into the OUTPUT, retry with a progressively tighter crop. One shared budget.
    for (let i = 0; i < regions.length; i++) {
      if (deadline - Date.now() <= GEN_MIN_MS) break;
      const { data, mimeType } = await garmentInline(request.source, regions[i]);
      const result = await callGemini(prompt, data, mimeType, deadline - Date.now());
      if (!result) continue; // blocked / empty: tighten and retry

      const isLast = i === regions.length - 1;
      if (!VERIFY_OUTPUT || deadline - Date.now() <= VERIFY_MIN_MS) {
        // No budget (or verification disabled) to re-check: accept this image.
        return result;
      }
      const verdict = await verifyNoPerson(result, deadline - Date.now());
      if (verdict !== 'person') return result; // 'clean' or 'unknown' -> good enough
      // A person leaked. If a tighter crop is still available, retry it; otherwise
      // fall through and fail so the caller falls back to "needs details" rather
      // than ever showing a person-in-frame image in a slot.
      if (isLast) break;
    }
    throw new Error('Gemini returned no clean garment image');
  }
}
