import { describe, expect, it } from '@jest/globals';

import type { Piece } from '../../data';
import { countLooks, DAILY_LOOK_MIN_PIECES, looksUnlocked } from '../looks';

const piece = (type: string | null): Piece => ({ type } as Piece);

describe('countLooks (honest closet capacity)', () => {
  it('counts a dress as one complete look on its own', () => {
    expect(countLooks([piece('שמלה')])).toBe(1);
  });

  it('counts each top x bottom pairing', () => {
    expect(countLooks([piece('חולצה'), piece('מכנסיים')])).toBe(1);
    expect(
      countLooks([piece('חולצה'), piece('חולצה'), piece('מכנסיים'), piece('מכנסיים')]),
    ).toBe(4);
  });

  it('never counts two tops or two bottoms as a look', () => {
    expect(countLooks([piece('חולצה'), piece('חולצה')])).toBe(0);
    expect(countLooks([piece('מכנסיים'), piece('מכנסיים')])).toBe(0);
  });

  it('treats shoes and accessories as finishers, not base looks', () => {
    expect(countLooks([piece('נעליים'), piece('תיק')])).toBe(0);
    expect(countLooks([piece('חולצה'), piece('מכנסיים'), piece('נעליים')])).toBe(1);
  });

  it('treats an untagged piece as a flexible body piece', () => {
    expect(countLooks([piece('חולצה'), piece(null)])).toBe(1); // untagged fills the lower half
    expect(countLooks([piece(null)])).toBe(0); // a lone untagged piece is not a look
  });
});

describe('looksUnlocked', () => {
  it('is the real difference and never negative', () => {
    const before = [piece('חולצה')]; // 0 looks
    const after = [...before, piece('מכנסיים')]; // 1 look
    expect(looksUnlocked(before, after)).toBe(1);
    expect(looksUnlocked(after, before)).toBe(0); // clamped, never a loss
  });

  it('reflects the multiplier effect of adding a top', () => {
    const before = [piece('חולצה'), piece('מכנסיים'), piece('מכנסיים')]; // 1 x 2 = 2
    const after = [...before, piece('חולצה')]; // 2 x 2 = 4
    expect(looksUnlocked(before, after)).toBe(2);
  });
});

describe('DAILY_LOOK_MIN_PIECES', () => {
  it('sits at the low end of the ~4-5 range', () => {
    expect(DAILY_LOOK_MIN_PIECES).toBeGreaterThanOrEqual(4);
    expect(DAILY_LOOK_MIN_PIECES).toBeLessThanOrEqual(5);
  });
});
