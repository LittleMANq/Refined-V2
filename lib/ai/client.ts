import { supabase } from '../data';
import type {
  GenerateOutfitInput,
  GeneratedOutfit,
  StylistChatInput,
  StylistChatResult,
} from './types';

/**
 * Thin app-side wrappers for the reasoning edge functions. No keys here; the
 * Anthropic key lives only in the functions' server environment. The user's
 * Supabase session JWT is attached automatically by supabase-js.
 */

export async function generateOutfit(input: GenerateOutfitInput): Promise<GeneratedOutfit> {
  const { data, error } = await supabase.functions.invoke<GeneratedOutfit>('generate-outfit', {
    body: input,
  });
  if (error) throw error;
  if (!data) throw new Error('generate-outfit returned no data');
  return data;
}

export async function stylistChat(input: StylistChatInput): Promise<StylistChatResult> {
  const { data, error } = await supabase.functions.invoke<StylistChatResult>('stylist-chat', {
    body: input,
  });
  if (error) throw error;
  if (!data) throw new Error('stylist-chat returned no data');
  return data;
}
