import { supabase } from './supabase';

/**
 * Remote feature flags. Every 🔒/⚪ feature is gated by a row in `features`;
 * flip it to reveal the feature, no redeploy. Flags are global, read-only config.
 */

/** Fetch all flags as a { key: enabled } map. */
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const { data, error } = await supabase.from('features').select('key, enabled');
  if (error) throw error;
  const flags: Record<string, boolean> = {};
  for (const row of data ?? []) {
    flags[row.key] = row.enabled;
  }
  return flags;
}

/** Read one flag, returning `fallback` (default false) if the flag is missing. */
export async function getFeatureFlag(key: string, fallback = false): Promise<boolean> {
  const { data, error } = await supabase
    .from('features')
    .select('enabled')
    .eq('key', key)
    .maybeSingle();
  if (error) throw error;
  return data?.enabled ?? fallback;
}
