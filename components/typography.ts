import type { TextStyle } from 'react-native';

import { fontFamilies } from './fonts';
import { colors } from './theme';

/**
 * The type scale — hierarchy through weight, not just size. Mirrors the
 * tokens.css type classes. lineHeight and letterSpacing are absolute px
 * (RN does not take unitless / em values), converted from the source em values.
 */
export const typeScale = {
  serifHero: {
    fontFamily: fontFamilies.serifMedium,
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: -0.46,
  },
  serifXl: {
    fontFamily: fontFamilies.serifMedium,
    fontSize: 38,
    lineHeight: 43,
  },
  serifTitle: {
    fontFamily: fontFamilies.serifRegular,
    fontSize: 22,
    lineHeight: 33,
  },
  head: {
    fontFamily: fontFamilies.sansLight,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.32,
  },
  title: {
    fontFamily: fontFamilies.sansLight,
    fontSize: 25,
    lineHeight: 31,
    letterSpacing: -0.13,
  },
  subtitle: {
    fontFamily: fontFamilies.sansRegular,
    fontSize: 17,
    lineHeight: 26,
    color: colors.secondary,
  },
  body: {
    fontFamily: fontFamilies.sansRegular,
    fontSize: 16,
    lineHeight: 26,
  },
  label: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  // The quiet text button (gallery .btn-text): 15px medium, secondary by default.
  btnText: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  labelSm: {
    fontFamily: fontFamilies.sansMedium,
    fontSize: 12.5,
    lineHeight: 16,
  },
  mono: {
    fontFamily: fontFamilies.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
  },
  // The smaller mono the gallery uses for header kickers / captions (9.5px).
  monoSm: {
    fontFamily: fontFamilies.mono,
    fontSize: 9.5,
    lineHeight: 12,
    letterSpacing: 0.76,
    textTransform: 'uppercase',
  },
  eyebrow: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2.42,
    textTransform: 'uppercase',
    color: colors.gold,
  },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof typeScale;
