/**
 * Refined design tokens — the single source of truth.
 * Mirrors docs/Design/app/tokens.css. Every screen imports from here and never
 * re-defines a color, radius, or shadow. One accent only (gold).
 */

export const colors = {
  // palette — the only colors in the system
  ink: '#1B1714',
  paper: '#FAF7F2',
  surface: '#F1ECE4',
  hairline: '#E2DBD0',
  secondary: '#8A8178',
  gold: '#B08953',
  white: '#FFFFFF',

  // derived tints (same hue family, no new colors)
  ink90: 'rgba(27, 23, 20, 0.90)',
  ink60: 'rgba(27, 23, 20, 0.60)',
  ink12: 'rgba(27, 23, 20, 0.12)',
  ink06: 'rgba(27, 23, 20, 0.06)',
  gold14: 'rgba(176, 137, 83, 0.14)',
  gold28: 'rgba(176, 137, 83, 0.28)',
  paper0: 'rgba(250, 247, 242, 0)',
  paper80: 'rgba(250, 247, 242, 0.80)',
} as const;

/** Warm toned fills for the 3:4 garment placeholders (intentional, reserved for real photography). */
export const slotTones = {
  a: '#E9E1D5',
  b: '#E3DACD',
  c: '#EEE7DC',
  ink: '#2A2420',
} as const;

export type SlotTone = keyof typeof slotTones;

/** Spacing scale. The system gutter is 24. */
export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 44,
  gutter: 24,
} as const;

export const radii = {
  sm: 8,
  md: 13,
  lg: 18,
  card: 24,
  slot: 20,
  slotSm: 16,
  sheet: 30,
  pill: 999,
  chip: 999,
} as const;

/**
 * Soft, dimensional, warm shadows. RN approximations of the layered CSS shadows
 * (iOS shadow* + Android elevation).
 */
export const shadows = {
  card: {
    shadowColor: '#1B1714',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  float: {
    shadowColor: '#1B1714',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 30,
    elevation: 16,
  },
  pill: {
    shadowColor: '#1B1714',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
} as const;

/**
 * Motion. Bezier control points match the gallery's --ease-cinema / --ease-soft.
 * Reveal builds Reanimated easings from these so timing stays single-sourced.
 */
export const motion = {
  ease: {
    cinema: [0.22, 0.61, 0.18, 1] as const,
    soft: [0.33, 0.0, 0.0, 1] as const,
  },
  duration: {
    reveal: 900,
    fade: 800,
    soft: 400,
  },
} as const;
