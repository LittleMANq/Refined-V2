import { useQuery } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';

import { getProfile, listPieces, supabase, type Piece, type Profile } from '../data';

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
