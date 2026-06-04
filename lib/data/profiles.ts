import { supabase } from './supabase';
import type { Profile, ProfileInsert, ProfileUpdate } from './types';

/** Thin profile access. No business logic — RLS restricts every call to the caller's own row. */

export async function getProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(profile: ProfileInsert): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, patch: ProfileUpdate): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
