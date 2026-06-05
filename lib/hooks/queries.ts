import { useQuery } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';

import { createSignedImageUrls, getProfile, listPieces, supabase, type Piece, type Profile } from '../data';

/** Shared query keys, so screens and mutations invalidate consistently. */
export const queryKeys = {
  user: ['user'] as const,
  profile: ['profile'] as const,
  pieces: ['pieces'] as const,
};

/** The current session user (null when signed out). Cached for the session. */
export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.user ?? null;
    },
    staleTime: Infinity,
  });
}

/** The signed-in user's profile (analysis + Style Identity + preferences). */
export function useProfile() {
  const { data: user } = useCurrentUser();
  return useQuery<Profile | null>({
    queryKey: queryKeys.profile,
    enabled: !!user,
    queryFn: () => getProfile(user!.id),
  });
}

/** The signed-in user's closet pieces (RLS returns only their own). */
export function usePieces() {
  const { data: user } = useCurrentUser();
  return useQuery<Piece[]>({
    queryKey: queryKeys.pieces,
    enabled: !!user,
    queryFn: () => listPieces(user!.id),
  });
}

/**
 * Batch-resolve signed URLs for private piece-image paths. Pass the pieces'
 * `image_url` values (nulls allowed); get back a { path -> signed URL } map.
 * One request for the whole grid. Refreshed before the signed URLs expire.
 */
export function useSignedImageUrls(paths: (string | null | undefined)[]) {
  const clean = Array.from(new Set(paths.filter((p): p is string => !!p))).sort();
  return useQuery<Record<string, string>>({
    queryKey: ['signed-images', clean.join('|')],
    enabled: clean.length > 0,
    staleTime: 50 * 60 * 1000, // under the 1h URL TTL, so links never go stale on screen
    queryFn: () => createSignedImageUrls(clean),
  });
}
