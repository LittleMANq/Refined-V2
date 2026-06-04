import type { AnalysisResult, ExtractedItem } from '../analysis/types';
import {
  insertOutfit,
  insertPiece,
  supabase,
  upsertProfile,
  type Analysis,
  type Gender,
  type OutfitInsert,
  type PieceInsert,
  type PreferenceProfile,
  type StyleIdentity,
} from '../data';
import { ensureSession } from './auth';
import { base64ToBytes } from './base64';

export interface CapturedPhoto {
  uri: string;
  base64: string;
  mediaType: string;
}

/** Everything the flow gathered, ready to be written to Supabase. */
export interface OnboardingData {
  gender: Gender;
  /** Lifestyle/context ids chosen on the context screen, e.g. ['work','smart']. */
  contexts: string[];
  /** Archetype ids chosen on the archetype screen. */
  archetypes: string[];
  taste: 'soft' | 'sharp' | null;
  fit: 'tailored' | 'regular' | 'relaxed' | null;
  photos: CapturedPhoto[];
  analysis: AnalysisResult;
  /** The extracted items the user chose to keep (their starter closet). */
  keptItems: ExtractedItem[];
}

export interface PersistResult {
  userId: string;
  pieceCount: number;
  outfitCount: number;
  photoCount: number;
}

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
};

/**
 * Best-effort upload of the source photos to the private `photos` bucket, under the
 * user's own uid folder (the only path their Storage RLS policy allows). Returns the
 * stored object paths. A storage hiccup never blocks onboarding: the analysis is
 * already done from the in-memory base64, so we just fall back to no source paths.
 */
async function uploadPhotos(userId: string, photos: CapturedPhoto[]): Promise<string[]> {
  const paths: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    if (!photo.base64) continue;
    const ext = EXT[photo.mediaType] ?? 'jpg';
    const path = `${userId}/onboarding/${i}.${ext}`;
    try {
      const { error } = await supabase.storage
        .from('photos')
        .upload(path, base64ToBytes(photo.base64), {
          contentType: photo.mediaType,
          upsert: true,
        });
      if (!error) paths.push(path);
    } catch {
      // non-fatal: keep going without this source path
    }
  }
  return paths;
}

function buildPreferenceProfile(data: OnboardingData): PreferenceProfile {
  const flatters = data.analysis.color_palette?.flatters ?? [];
  const silhouettes =
    data.taste === 'sharp'
      ? ['מחויט', 'נקי']
      : data.taste === 'soft'
        ? ['נופל', 'רך']
        : [];
  if (data.fit) silhouettes.push(data.fit);

  const formalityByContext: Record<string, number> = {
    casual: 1,
    smart: 2,
    work: 3,
    evening: 4,
  };
  const ranks = data.contexts.map((c) => formalityByContext[c]).filter((r): r is number => !!r);
  const formality_bias = ranks.length
    ? Number((ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(2))
    : 2;

  return {
    favored_colors: flatters.slice(0, 4),
    favored_silhouettes: silhouettes,
    formality_bias,
  };
}

/**
 * Persist the onboarding result. Writes ONLY the caller's own rows (RLS enforces it):
 *  - profiles: the personal analysis + Style Identity + light preference profile
 *  - pieces:   the kept extracted items, as the starter closet (source = photo_analysis)
 *  - outfits:  the first looks, with their Hebrew reasoning (the saved-look the DoD wants)
 * The service-role key is never used; this runs with the user's session.
 */
export async function persistOnboarding(data: OnboardingData): Promise<PersistResult> {
  const user = await ensureSession();
  const userId = user.id;

  const sourcePhotos = await uploadPhotos(userId, data.photos);
  const a = data.analysis;

  const analysis: Analysis = {
    body_type: a.body_type,
    proportions: a.proportions,
    skin_tone: a.skin_tone,
    color_season: a.color_season,
    contrast: a.contrast,
    color_palette: a.color_palette,
    source_photos: sourcePhotos,
  };

  const styleIdentity: StyleIdentity = {
    name: a.styleIdentity.name,
    description: a.styleIdentity.description,
    archetypes: data.archetypes,
  };

  await upsertProfile({
    id: userId,
    gender: data.gender,
    style_context: data.contexts.join(','),
    analysis,
    style_identity: styleIdentity,
    body: data.fit ? { fit_preferences: [data.fit] } : null,
    preference_profile: buildPreferenceProfile(data),
  });

  // Starter closet from the kept extracted items.
  const firstPhoto = sourcePhotos[0] ?? null;
  let pieceCount = 0;
  for (const item of data.keptItems) {
    const piece: PieceInsert = {
      user_id: userId,
      type: item.type,
      color: item.color ?? null,
      pattern: item.pattern ?? null,
      attributes: item.attributes ?? null,
      source: 'photo_analysis',
      extracted_from_photo_id: firstPhoto,
    };
    await insertPiece(piece);
    pieceCount++;
  }

  // First looks, each with its real Hebrew reasoning. The first is saved (DoD: a saved look).
  let outfitCount = 0;
  for (let i = 0; i < a.looks.length; i++) {
    const look = a.looks[i];
    const reasoning = [look.title, look.description].filter(Boolean).join('. ');
    const outfit: OutfitInsert = {
      owner_id: userId,
      user_ids: [userId],
      piece_ids: [],
      occasion: null,
      reasoning,
      generated_by: 'ai',
      saved: i === 0,
    };
    await insertOutfit(outfit);
    outfitCount++;
  }

  return { userId, pieceCount, outfitCount, photoCount: sourcePhotos.length };
}
