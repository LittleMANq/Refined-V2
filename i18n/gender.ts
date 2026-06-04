// The captured gender drives gendered-singular copy across the app.
// Kept local to i18n (structurally identical to the data-layer Gender) so the
// dictionary has no dependency on /lib.
export type Gender = 'woman' | 'man' | 'unspecified';
