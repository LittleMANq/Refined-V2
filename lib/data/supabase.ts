import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { Database } from './types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.',
  );
}

type SessionStore = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

/**
 * SSR-safe auth storage.
 * - Native: AsyncStorage (persists across launches).
 * - Web in the browser: window.localStorage (persists across reloads).
 * - Web during static render (Expo Router SSR, no `window`): an in-memory store, so
 *   constructing the auth client never touches `window` on the server. The browser
 *   re-evaluates this module with a real localStorage, so web persistence is intact.
 *
 * AsyncStorage's web build reads window.localStorage on access, which throws during
 * the server render where `window` is undefined, so we never route web through it.
 */
function webStorage(): SessionStore {
  const ls = (
    globalThis as unknown as {
      localStorage?: {
        getItem(k: string): string | null;
        setItem(k: string, v: string): void;
        removeItem(k: string): void;
      };
    }
  ).localStorage;

  if (ls) {
    return {
      getItem: (key) => Promise.resolve(ls.getItem(key)),
      setItem: (key, value) => Promise.resolve(ls.setItem(key, value)),
      removeItem: (key) => Promise.resolve(ls.removeItem(key)),
    };
  }

  const memory = new Map<string, string>();
  return {
    getItem: (key) => Promise.resolve(memory.get(key) ?? null),
    setItem: (key, value) => {
      memory.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      memory.delete(key);
      return Promise.resolve();
    },
  };
}

const storage: SessionStore = Platform.OS === 'web' ? webStorage() : AsyncStorage;

// Public anon / publishable key only.
// The service-role key is server-side (Supabase Edge Functions) and must NEVER be imported here.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
