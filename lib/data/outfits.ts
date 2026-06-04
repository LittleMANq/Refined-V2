import { supabase } from './supabase';
import type { Outfit, OutfitInsert, OutfitUpdate } from './types';

/**
 * Thin outfit access. RLS returns only outfits the caller is a member of
 * (user_ids contains their uid). Today that is just their own outfits; the
 * membership model is reserved for couple mode.
 */

export async function listOutfits(userId: string): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .contains('user_ids', [userId])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getOutfit(id: string): Promise<Outfit | null> {
  const { data, error } = await supabase.from('outfits').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function insertOutfit(outfit: OutfitInsert): Promise<Outfit> {
  const { data, error } = await supabase.from('outfits').insert(outfit).select().single();
  if (error) throw error;
  return data;
}

export async function updateOutfit(id: string, patch: OutfitUpdate): Promise<Outfit> {
  const { data, error } = await supabase
    .from('outfits')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOutfit(id: string): Promise<void> {
  const { error } = await supabase.from('outfits').delete().eq('id', id);
  if (error) throw error;
}
