import type { GarmentImageRequest } from '../../../lib/analysis/types.ts';
import { NanoBananaImageProvider } from '../_shared/garment-image-nanobanana.ts';
import { fail, json, preflight } from '../_shared/http.ts';

/**
 * `generate-garment-image` — the active GarmentImageProvider endpoint. A garment
 * photo + detected tags in, a clean catalog-style image of that single garment out
 * (Gemini "Nano Banana"). Output is base64, ready for the app to upload to Storage
 * and write as image_url. The Gemini key lives only in the GEMINI_API_KEY secret.
 *
 * On any failure (including timeout) it returns a structured 500 so the add flow
 * stays graceful (piece saves as "needs details"), never a crash. The old
 * crop-garment function is kept in the repo but no longer on the active path.
 */
Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const input = (await req.json()) as GarmentImageRequest;
    if (!input?.source?.base64 && !input?.source?.url) {
      return fail('A source image (base64 or url) is required', 422);
    }

    const provider = new NanoBananaImageProvider();
    const result = await provider.produce(input);
    return json(result);
  } catch (err) {
    return fail('Garment image generation failed', 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
