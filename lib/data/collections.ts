import { supabase } from './supabase';
import type { Collection, CollectionInsert, CollectionUpdate } from './types';

/** Thin collection access. RLS restricts every call to the caller's own collections. */

export async function listCollections(userId: string): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCollection(id: string): Promise<Collection | null> {
  const { data, error } = await supabase.from('collections').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function insertCollection(collection: CollectionInsert): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .insert(collection)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCollection(id: string, patch: CollectionUpdate): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCollection(id: string): Promise<void> {
  const { error } = await supabase.from('collections').delete().eq('id', id);
  if (error) throw error;
}
