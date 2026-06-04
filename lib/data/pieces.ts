import { supabase } from './supabase';
import type { Piece, PieceInsert, PieceUpdate } from './types';

/** Thin wardrobe-piece access. RLS restricts every call to the caller's own pieces. */

export async function listPieces(userId: string): Promise<Piece[]> {
  const { data, error } = await supabase
    .from('pieces')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPiece(id: string): Promise<Piece | null> {
  const { data, error } = await supabase.from('pieces').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function insertPiece(piece: PieceInsert): Promise<Piece> {
  const { data, error } = await supabase.from('pieces').insert(piece).select().single();
  if (error) throw error;
  return data;
}

export async function updatePiece(id: string, patch: PieceUpdate): Promise<Piece> {
  const { data, error } = await supabase
    .from('pieces')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePiece(id: string): Promise<void> {
  const { error } = await supabase.from('pieces').delete().eq('id', id);
  if (error) throw error;
}
