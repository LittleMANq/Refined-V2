import { supabase } from './supabase';

/**
 * Private-photo access. Piece images live in the private `photos` bucket under the
 * owner's uid folder (storage RLS); `Piece.image_url` holds the object PATH, not a
 * URL. To render a piece we mint a short-lived signed URL. Signing in one batch
 * (createSignedUrls) keeps the closet grid to a single request, not one per cell.
 */

const PHOTOS_BUCKET = 'photos';
/** Signed-URL lifetime. The hook re-fetches before this elapses (see useSignedImageUrls). */
export const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

/** Map of { storage path -> signed URL } for the given paths (deduped; blanks dropped). */
export async function createSignedImageUrls(paths: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(paths.filter((p): p is string => !!p)));
  if (unique.length === 0) return {};

  const { data, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrls(unique, SIGNED_URL_TTL_SECONDS);
  if (error) throw error;

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.path && row.signedUrl) map[row.path] = row.signedUrl;
  }
  return map;
}
