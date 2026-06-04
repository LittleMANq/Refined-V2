/**
 * Onboarding route paths. The `(onboarding)` group is omitted from the URL, so each
 * screen lives at a top-level path. Centralized so navigation has no stringly-typed
 * typos and the linear order is documented in one place.
 */
export const ROUTES = {
  intro: '/intro',
  context: '/context',
  archetype: '/archetype',
  capture: '/capture',
  analysis: '/analysis',
  review: '/review',
  taste: '/taste',
  reveal: '/reveal',
  signup: '/signup',
  permissions: '/permissions',
  today: '/today',
} as const;

/** Progress shown on the calm onboarding screens (intro/analysis/signup/perms are unmetered). */
export const ONBOARDING_STEPS = 7;
