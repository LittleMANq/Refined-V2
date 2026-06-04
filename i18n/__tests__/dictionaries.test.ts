import { describe, expect, it } from '@jest/globals';

import { en } from '../en';
import { he } from '../he';

function paths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object'
      ? paths(value as Record<string, unknown>, path)
      : [path];
  });
}

describe('i18n dictionaries', () => {
  it('he and en expose identical keys (no missing or orphan strings)', () => {
    expect(paths(en).sort()).toEqual(paths(he).sort());
  });
});
