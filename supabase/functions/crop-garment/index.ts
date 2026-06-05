import type { GarmentImageRequest } from '../../../lib/analysis/types.ts';
import { CropGarmentImageProvider } from '../_shared/garment-image-crop.ts';
import { fail, json, preflight } from '../_shared/http.ts';

/**
 * `crop-garment` — the GarmentImageProvider endpoint: a photo + region in, a focused
 * cropped slot image out (base64 JPEG). Pure geometry, no API key. This is the MVP
 * "cutout" step; a real background-removal provider can replace the impl behind the
 * same GarmentImageProvider interface with zero caller changes.
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

    const provider = new CropGarmentImageProvider();
    const result = await provider.produce(input);
    return json(result);
  } catch (err) {
    return fail('Garment image generation failed', 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
