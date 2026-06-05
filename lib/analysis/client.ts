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
 * Produce a per-garment slot image from a photo + region (the swappable
 * GarmentImageProvider; today a focused crop). Returns base64 ready to upload.
 */
export async function produceGarmentImage(request: GarmentImageRequest): Promise<GarmentImageResult> {
  const { data, error } = await supabase.functions.invoke<GarmentImageResult>('crop-garment', {
    body: request,
  });
  if (error) throw error;
  if (!data) throw new Error('crop-garment returned no data');
  return data;
}
