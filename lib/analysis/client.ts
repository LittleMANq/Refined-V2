import { supabase } from '../data';
import type { AnalysisInput, AnalysisResult } from './types';

/**
 * Thin app-side wrapper for the `analyze` edge function. No keys here; the
 * Anthropic key lives only in the function's server environment. The user's
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
