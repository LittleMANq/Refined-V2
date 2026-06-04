import { describe, expect, it } from '@jest/globals';

import { en } from '../en';
import type { Gender } from '../gender';
import { he } from '../he';

function paths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object'
      ? paths(value as Record<string, unknown>, path)
      : [path];
  });
}

const GENDERS: Gender[] = ['woman', 'man', 'unspecified'];

describe('i18n dictionaries', () => {
  it('he and en expose identical keys for every gender (no missing or orphan strings)', () => {
    for (const gender of GENDERS) {
      expect(paths(en(gender)).sort()).toEqual(paths(he(gender)).sort());
    }
  });

  it('he keeps the same key shape across genders (only the values change)', () => {
    const base = paths(he('woman')).sort();
    expect(paths(he('man')).sort()).toEqual(base);
    expect(paths(he('unspecified')).sort()).toEqual(base);
  });

  it('serves the feminine variant to women and the unmarked form otherwise', () => {
    expect(he('woman').common.skip).toBe('דלגי');
    expect(he('man').common.skip).toBe('דלג');
    expect(he('unspecified').common.skip).toBe('דלג');
  });
});
