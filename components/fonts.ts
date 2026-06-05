import {
  FrankRuhlLibre_400Regular,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_700Bold,
} from '@expo-google-fonts/frank-ruhl-libre';
import { GeistMono_400Regular, GeistMono_500Medium } from '@expo-google-fonts/geist-mono';
import {
  Heebo_300Light,
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_700Bold,
} from '@expo-google-fonts/heebo';
import { useFonts } from 'expo-font';

/**
 * Font family names, mapped by role. Hierarchy comes from weight contrast:
 * Heebo (sans) carries the UI, Frank Ruhl Libre (serif) is reserved for hero moments,
 * Geist Mono carries the tracked-uppercase eyebrows / labels (the editorial caption
 * texture). RN selects a face by family name, so each weight is its own family (do
 * not also set fontWeight, or you get faux styling).
 */
export const fontFamilies = {
  sansLight: 'Heebo_300Light',
  sansRegular: 'Heebo_400Regular',
  sansMedium: 'Heebo_500Medium',
  sansBold: 'Heebo_700Bold',
  serifRegular: 'FrankRuhlLibre_400Regular',
  serifMedium: 'FrankRuhlLibre_500Medium',
  serifBold: 'FrankRuhlLibre_700Bold',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
} as const;

const fontMap = {
  Heebo_300Light,
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_700Bold,
  FrankRuhlLibre_400Regular,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_700Bold,
  GeistMono_400Regular,
  GeistMono_500Medium,
};

/** Loads all app fonts. Returns [loaded, error] from expo-font's useFonts. */
export function useAppFonts(): [boolean, Error | null] {
  return useFonts(fontMap);
}
