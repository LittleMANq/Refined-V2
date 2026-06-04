import { supabase } from './supabase';
import type { Recommendation, RecommendationInsert } from './types';

/**
 * Thin recommendation access (RESERVED — shopping is off at launch). RLS
 * restricts every call to the caller's own rows; rows are written server-side later.
 */

export async function listRecommendations(userId: string): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getRecommendation(id: string): Promise<Recommendation | null> {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function insertRecommendation(rec: RecommendationInsert): Promise<Recommendation> {
  const { data, error } = await supabase.from('recommendations').insert(rec).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRecommendation(id: string): Promise<void> {
  const { error } = await supabase.from('recommendations').delete().eq('id', id);
  if (error) throw error;
}
