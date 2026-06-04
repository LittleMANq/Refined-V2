import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { I18nManager } from 'react-native';

import { en } from './en';
import { he } from './he';

export type Locale = 'he' | 'en';

// `he` defines the dictionary shape; `en` is checked against it below,
// so a missing or orphan key is a compile-time error.
export type Dictionary = typeof he;

const dictionaries: Record<Locale, Dictionary> = { he, en };

export const DEFAULT_LOCALE: Locale = 'he';

const RTL_LOCALES: readonly Locale[] = ['he'];

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/**
 * Force the layout direction for the given locale.
 * Note: on native, a direction change only fully applies after an app reload
 * (an I18nManager limitation), so we force it once at startup for the default locale.
 */
export function applyRTL(locale: Locale): void {
  const shouldBeRTL = isRTL(locale);
  I18nManager.allowRTL(shouldBeRTL);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.forceRTL(shouldBeRTL);
  }
}

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: dictionaries[locale],
      setLocale,
      toggleLocale: () => setLocale((current) => (current === 'he' ? 'en' : 'he')),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
