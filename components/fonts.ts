import {
  FrankRuhlLibre_400Regular,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_700Bold,
} from '@expo-google-fonts/frank-ruhl-libre';
import {
  Heebo_300Light,
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_700Bold,
} from '@expo-google-fonts/heebo';
import { useFonts } from 'expo-font';
import { Platform } from 'react-native';

/**
 * Font family names, mapped by role. Hierarchy comes from weight contrast:
 * Heebo (sans) carries the UI, Frank Ruhl Libre (serif) is reserved for hero moments.
 * RN selects a face by family name, so each weight is its own family (do not also
 * set fontWeight, or you get faux styling).
 */
export const fontFamilies = {
  sansLight: 'Heebo_300Light',
  sansRegular: 'Heebo_400Regular',
  sansMedium: 'Heebo_500Medium',
  sansBold: 'Heebo_700Bold',
  serifRegular: 'FrankRuhlLibre_400Regular',
  serifMedium: 'FrankRuhlLibre_500Medium',
  serifBold: 'FrankRuhlLibre_700Bold',
  // No bespoke mono ships with the system; fall back to the platform monospace.
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
} as const;

const fontMap = {
  Heebo_300Light,
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_700Bold,
  FrankRuhlLibre_400Regular,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_700Bold,
};

/** Loads all app fonts. Returns [loaded, error] from expo-font's useFonts. */
export function useAppFonts(): [boolean, Error | null] {
  return useFonts(fontMap);
}
