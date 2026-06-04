import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { I18nManager } from 'react-native';

import { en } from './en';
import type { Gender } from './gender';
import { he } from './he';

export type Locale = 'he' | 'en';
export type { Gender } from './gender';

// `he` defines the dictionary shape; `en` is checked against it below,
// so a missing or orphan key is a compile-time error. The dictionary is a
// function of the captured gender so copy is gendered-singular.
export type Dictionary = ReturnType<typeof he>;

const builders: Record<Locale, (gender: Gender) => Dictionary> = { he, en };

export const DEFAULT_LOCALE: Locale = 'he';
export const DEFAULT_GENDER: Gender = 'unspecified';

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
  gender: Gender;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Captured during onboarding; switches all copy to the right gendered-singular form. */
  setGender: (gender: Gender) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [gender, setGender] = useState<Gender>(DEFAULT_GENDER);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      gender,
      t: builders[locale](gender),
      setLocale,
      toggleLocale: () => setLocale((current) => (current === 'he' ? 'en' : 'he')),
      setGender,
    }),
    [locale, gender],
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
