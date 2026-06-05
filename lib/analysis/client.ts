import { supabase } from '../data';
import type { AnalysisInput, AnalysisResult, GarmentTag, GarmentTagInput } from './types';

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
