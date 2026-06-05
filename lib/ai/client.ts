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

/**
 * Thrown when the closet is too small to build a valid look (the function returns
 * 422 with `need_more_pieces`). The UI shows the designed "add more pieces" state
 * instead of a generic error.
 */
export class NeedMorePiecesError extends Error {
  constructor(message = 'Not enough closet pieces to build a look') {
    super(message);
    this.name = 'NeedMorePiecesError';
  }
}

async function readFunctionError(
  error: unknown,
): Promise<{ need_more_pieces?: boolean; error?: string } | null> {
  const context = (error as { context?: unknown }).context;
  if (context && typeof (context as Response).json === 'function') {
    try {
      return (await (context as Response).json()) as { need_more_pieces?: boolean; error?: string };
    } catch {
      return null;
    }
  }
  return null;
}

export async function generateOutfit(input: GenerateOutfitInput): Promise<GeneratedOutfit> {
  const { data, error } = await supabase.functions.invoke<GeneratedOutfit>('generate-outfit', {
    body: input,
  });
  if (error) {
    const body = await readFunctionError(error);
    if (body?.need_more_pieces) throw new NeedMorePiecesError(body.error);
    throw error;
  }
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
