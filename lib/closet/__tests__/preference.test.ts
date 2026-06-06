import { describe, expect, it } from '@jest/globals';

import { derivePreferenceProfile } from '../preference';

// Minimal pieces (only the fields the derivation reads).
const pieces = [
  { id: 'p1', color: 'כחול', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
  { id: 'p2', color: 'ירוק', attributes: { silhouette: 'רחב', formality: 'יומיום' } },
  { id: 'p3', color: 'חול', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
];

describe('derivePreferenceProfile (saves/dismissals -> preference_profile)', () => {
  it('promotes colors/silhouettes from saved looks (profile changes after a signal)', () => {
    const base = { favored_colors: [], favored_silhouettes: [], formality_bias: 2 };
    const before = base;
    const after = derivePreferenceProfile([{ piece_ids: ['p1'], saved: true, dismissed: false }], pieces, base);
    expect(before.favored_colors).toEqual([]); // nothing learned yet
    expect(after.favored_colors).toContain('כחול'); // the saved look's color is now favored
    expect(after.favored_silhouettes).toContain('מחויט');
  });

  it('drops a color when its looks are dismissed, even if it was a baseline', () => {
    const base = { favored_colors: ['ירוק'], favored_silhouettes: [], formality_bias: 2 };
    const after = derivePreferenceProfile([{ piece_ids: ['p2'], saved: false, dismissed: true }], pieces, base);
    expect(after.favored_colors).not.toContain('ירוק'); // dismissed -> removed even from the seed
  });

  it('keeps undismissed onboarding-seed colors as a baseline tail behind learned ones', () => {
    const base = { favored_colors: ['חול'], favored_silhouettes: [], formality_bias: 2 };
    const after = derivePreferenceProfile([{ piece_ids: ['p1'], saved: true, dismissed: false }], pieces, base);
    expect(after.favored_colors?.[0]).toBe('כחול'); // the saved signal leads
    expect(after.favored_colors).toContain('חול'); // the seed remains as a tail
  });

  it('leans formality_bias halfway toward kept looks', () => {
    const base = { favored_colors: [], favored_silhouettes: [], formality_bias: 1 };
    // saved p1 is 'סמארט' (rank 2); bias drifts from 1 halfway toward 2 -> 1.5
    const after = derivePreferenceProfile([{ piece_ids: ['p1'], saved: true, dismissed: false }], pieces, base);
    expect(after.formality_bias).toBeCloseTo(1.5, 5);
  });

  it('ignores looks that are neither saved nor dismissed', () => {
    const base = { favored_colors: [], favored_silhouettes: [], formality_bias: 2 };
    const after = derivePreferenceProfile([{ piece_ids: ['p1'], saved: false, dismissed: false }], pieces, base);
    expect(after.favored_colors).toEqual([]); // no signal -> no change
  });
});
