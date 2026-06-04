import type { User } from '@supabase/supabase-js';

import { supabase } from '../data';

/**
 * Ensure there is a signed-in session before the analysis runs. Onboarding is
 * anonymous-first (docs §Soft sign-up): the analysis can run pre-account, then the
 * soft sign-up upgrades the SAME anonymous user to a real account, so nothing the
 * user created is lost. The Anthropic key stays server-side; the edge function
 * authorizes with this session's JWT.
 */
export async function ensureSession(): Promise<User> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user) return sessionData.session.user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error('No user returned from anonymous sign-in');
  return data.user;
}
