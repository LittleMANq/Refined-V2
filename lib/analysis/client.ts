import { supabase } from '../data';
import type {
  AnalysisInput,
  AnalysisResult,
  DetectGarmentsInput,
  DetectGarmentsResult,
  GarmentImageRequest,
  GarmentImageResult,
  GarmentTag,
  GarmentTagInput,
} from './types';

/**
 * Thin app-side wrappers for the analysis edge functions. No keys here; the
 * Anthropic key lives only in the functions' server environment. The user's
 * Supabase session JWT is attached automatically by supabase-js.
 */
export async function analyzePhotos(input: AnalysisInput): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke<AnalysisResult>('analyze', {
    body: input,
  });
  if (error) throw error;
  if (!data) throw new Error('analyze returned no data');
  return data;
}

/**
 * Tag a single garment photo (library / camera add). Returns the Piece tags.
 * Callers treat a thrown error as non-fatal: the piece is still saved untagged
 * (a "needs details" state), never blocked.
 */
export async function tagGarment(input: GarmentTagInput): Promise<GarmentTag> {
  const { data, error } = await supabase.functions.invoke<GarmentTag>('tag-piece', {
    body: input,
  });
  if (error) throw error;
  if (!data) throw new Error('tag-piece returned no data');
  return data;
}

/**
 * Detect every distinct garment in a photo. The caller shows them as selectable
 * cards and crops each pick via `produceGarmentImage`. Shared by the library/camera
 * add flow and onboarding item extraction.
 */
export async function detectGarments(input: DetectGarmentsInput): Promise<DetectGarmentsResult> {
  const { data, error } = await supabase.functions.invoke<DetectGarmentsResult>('detect-garments', {
    body: input,
  });
  if (error) throw error;
  if (!data) throw new Error('detect-garments returned no data');
  return data;
}

/**
 * Produce a per-garment slot image from a photo (+ region + tags) via the swappable
 * GarmentImageProvider. The active provider generates a clean catalog-style image
 * of the garment with Gemini ("Nano Banana"). Returns base64 ready to upload.
 * Callers treat a thrown error as non-fatal (the piece saves as "needs details").
 */
export async function produceGarmentImage(request: GarmentImageRequest): Promise<GarmentImageResult> {
  const { data, error } = await supabase.functions.invoke<GarmentImageResult>('generate-garment-image', {
    body: request,
  });
  if (error) throw error;
  if (!data) throw new Error('generate-garment-image returned no data');
  return data;
}

/**
 * Crop the source photo to a garment's region for a quick PREVIEW thumbnail at pick
 * time (the same pure server-side geometry as the closet crop, no AI, no key). This
 * is NOT the clean catalog image: it is just a recognizable crop of the real item to
 * show in the selection card before the user picks. The expensive catalog image is
 * still generated only AFTER selection, for picked items. Callers treat a thrown
 * error as non-fatal (the card falls back to the toned placeholder slot).
 */
export async function cropGarmentImage(request: GarmentImageRequest): Promise<GarmentImageResult> {
  const { data, error } = await supabase.functions.invoke<GarmentImageResult>('crop-garment', {
    body: request,
  });
  if (error) throw error;
  if (!data) throw new Error('crop-garment returned no data');
  return data;
}
