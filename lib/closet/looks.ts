import type { Piece } from '../data';
import { pieceCategory } from './category';

/**
 * Closet capacity math — the honest "how many looks can this closet build" count,
 * and the floor at which the daily look unlocks. Used by the Today thin-state
 * (how many pieces are still needed) and the add-piece flow (how many new looks a
 * piece just unlocked). Numbers here are always derived from the real closet and
 * are deliberately conservative, never inflated.
 */

/**
 * The piece count at which we start promising a daily look. Below it, Today shows
 * a specific, motivating "add N more" state instead of a dead end. Chosen as the
 * low end of the ~4-5 range: a closet this size can already form a real look.
 */
export const DAILY_LOOK_MIN_PIECES = 4;

/**
 * Count the distinct looks a closet can build, mirroring the stylist engine's
 * notion of a look: a dress on its own, or any upper + lower pairing. Shoes and
 * accessories finish a look, they do not create one, so they are excluded from
 * the combinatorics. An untagged piece ('other') is a real garment we have not
 * classified yet, so it counts as a flexible body piece that can sit on either
 * half of a pairing, exactly as the engine treats it.
 *
 * looks = dresses + (every body pair that is not top+top or bottom+bottom)
 */
export function countLooks(pieces: Piece[]): number {
  let tops = 0;
  let bottoms = 0;
  let dresses = 0;
  let others = 0;
  for (const piece of pieces) {
    switch (pieceCategory(piece)) {
      case 'dresses':
        dresses += 1;
        break;
      case 'tops':
        tops += 1;
        break;
      case 'bottoms':
        bottoms += 1;
        break;
      case 'other':
        others += 1;
        break;
      // shoes + accessories: finishers, not base looks.
    }
  }

  const body = tops + bottoms + others;
  const choose2 = (n: number) => (n * (n - 1)) / 2;
  // All body pairs, minus the impossible ones (two tops, or two bottoms).
  const pairs = choose2(body) - choose2(tops) - choose2(bottoms);
  return dresses + pairs;
}

/**
 * The real, earned number of new looks that going from `before` to `after`
 * unlocked. Clamped at zero so it never reads as a loss.
 */
export function looksUnlocked(before: Piece[], after: Piece[]): number {
  return Math.max(0, countLooks(after) - countLooks(before));
}
