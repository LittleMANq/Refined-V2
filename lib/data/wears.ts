import { supabase } from './supabase';
import type { PieceWearInsert } from './types';

/**
 * Wear history access. Appends to the `piece_wears` log (the dated source of
 * truth); a DB trigger rolls each row up into `pieces.wear_count` / `last_worn`.
 * RLS restricts every write to the caller's own pieces. RECORDING ONLY: nothing
 * here reads or aggregates the log (insights / weekly progress / Wrapped are future).
 */

/**
 * Record that the pieces in a worn look were worn now. One log row per piece;
 * the trigger increments wear_count and advances last_worn for each. `wornAtIso`
 * should match the outfit's `logged_at` so the look and its wear rows agree.
 */
export async function recordOutfitWear(input: {
  userId: string;
  outfitId: string | null;
  pieceIds: string[];
  wornAtIso?: string;
}): Promise<void> {
  if (!input.pieceIds.length) return;
  const worn_at = input.wornAtIso ?? new Date().toISOString();
  const rows: PieceWearInsert[] = input.pieceIds.map((piece_id) => ({
    user_id: input.userId,
    piece_id,
    outfit_id: input.outfitId,
    worn_at,
  }));
  const { error } = await supabase.from('piece_wears').insert(rows);
  if (error) throw error;
}
