import { useQuery } from '@tanstack/react-query';

import { getFeatureFlags } from '../data';

/**
 * Remote feature flags, the "build the ground" switchboard. Every 🔒/⚪ surface is
 * gated by a row in the `features` table; flip a row to `enabled = true` and the
 * surface appears on the next fetch, with NO app redeploy. Flags are global,
 * read-only config (the `features` RLS lets anyone read, no client can write).
 */

export const featureQueryKey = ['features'] as const;

/** All flags as a { key: enabled } map. Cached; refreshes periodically and on reload. */
export function useFeatureFlags() {
  return useQuery<Record<string, boolean>>({
    queryKey: featureQueryKey,
    queryFn: getFeatureFlags,
    // Short enough that flipping a flag surfaces quickly (a reload picks it up at
    // once); long enough that we are not refetching config on every render.
    staleTime: 60 * 1000,
  });
}

/**
 * Read one flag with a safe default (OFF). A scaffolded/future surface renders
 * only when its flag is true, so everything stays hidden until intentionally
 * flipped on. Missing flag or not-yet-loaded config -> `fallback` (default false).
 */
export function useFeatureFlag(key: string, fallback = false): boolean {
  const { data } = useFeatureFlags();
  return data?.[key] ?? fallback;
}
