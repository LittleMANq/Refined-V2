import { useMutation, useQuery } from '@tanstack/react-query';

import {
  generateOutfit,
  type AnalysisCore,
  type ClosetPiece,
  type GeneratedOutfit,
  type GenerateOutfitInput,
} from '../ai';
import {
  insertOutfit,
  recordOutfitWear,
  type Analysis,
  type Gender,
  type Outfit,
  type Piece,
  type Profile,
} from '../data';
import { usePieces, useProfile } from './queries';

/** Default occasion for the Today daily look (calm, everyday register). */
export const DEFAULT_OCCASION = 'יומיום';

export function pieceToClosetPiece(piece: Piece): ClosetPiece {
  return {
    id: piece.id,
    type: piece.type,
    subtype: piece.subtype,
    color: piece.color,
    pattern: piece.pattern,
    season: piece.season,
    attributes: piece.attributes,
  };
}

function analysisCore(analysis: Analysis | null | undefined): AnalysisCore {
  return {
    body_type: analysis?.body_type,
    proportions: analysis?.proportions,
    skin_tone: analysis?.skin_tone,
    color_season: analysis?.color_season,
    color_palette: analysis?.color_palette,
  };
}

/** Build the generate-outfit input from the user's persisted profile + closet. */
export function buildOutfitInput(profile: Profile, pieces: Piece[], occasion: string): GenerateOutfitInput {
  return {
    analysis: analysisCore(profile.analysis),
    styleIdentity: {
      name: profile.style_identity?.name ?? 'הסטייל שלך',
      description: profile.style_identity?.description,
    },
    closet: pieces.map(pieceToClosetPiece),
    context: {
      gender: (profile.gender ?? 'unspecified') as Gender,
      occasion,
    },
  };
}

/**
 * The Today daily look: a real generate-outfit call over the user's pieces +
 * palette + occasion. Cached (no auto-refetch); call `refetch` to regenerate.
 * Errors (including NeedMorePiecesError) surface on `error` for the UI to branch.
 */
export function useDailyLook(occasion: string = DEFAULT_OCCASION) {
  const { data: profile } = useProfile();
  const { data: pieces } = usePieces();
  const ready = !!profile && !!pieces;

  return useQuery<GeneratedOutfit>({
    queryKey: ['dailyLook', occasion, pieces?.length ?? 0],
    enabled: ready,
    queryFn: () => generateOutfit(buildOutfitInput(profile!, pieces!, occasion)),
    staleTime: Infinity,
    retry: false,
  });
}

/** On-demand generation for the Create screen (pick occasion, then generate). */
export function useGenerateOutfit() {
  const { data: profile } = useProfile();
  const { data: pieces } = usePieces();

  return useMutation<GeneratedOutfit, Error, string>({
    mutationFn: (occasion: string) => {
      if (!profile || !pieces) throw new Error('Profile or closet not loaded');
      return generateOutfit(buildOutfitInput(profile, pieces, occasion));
    },
  });
}

/** Persist a generated look as an outfit (the save / "I wore it" signals). */
export async function persistGeneratedOutfit(
  userId: string,
  look: GeneratedOutfit,
  options: { saved?: boolean; worn?: boolean; nowIso?: string } = {},
): Promise<Outfit> {
  const { saved = true, worn = false, nowIso } = options;
  const wornAt = worn ? (nowIso ?? new Date().toISOString()) : null;
  const outfit = await insertOutfit({
    owner_id: userId,
    user_ids: [userId],
    piece_ids: look.piece_ids,
    occasion: look.occasion,
    reasoning: look.reasoning,
    generated_by: 'ai',
    saved,
    logged_at: wornAt,
  });

  // When the look is marked WORN, record per-piece wear history from today (a
  // dated wear-log row per piece; a trigger rolls it into wear_count/last_worn),
  // so future closet-insights / weekly-progress / Wrapped have real usage to read.
  // Best-effort: the outfit is already saved, so a wear-log hiccup never blocks
  // the user's "I wore it" confirmation.
  if (worn && wornAt && look.piece_ids.length) {
    try {
      await recordOutfitWear({ userId, outfitId: outfit.id, pieceIds: look.piece_ids, wornAtIso: wornAt });
    } catch {
      // non-fatal: wear history is a background signal, not part of the save UX
    }
  }
  return outfit;
}
