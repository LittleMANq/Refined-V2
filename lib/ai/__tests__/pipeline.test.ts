import { describe, expect, it } from '@jest/globals';

import { selectOutfit } from '../pipeline';
import type { GenerateOutfitInput } from '../types';

const base: Omit<GenerateOutfitInput, 'closet'> = {
  analysis: {
    proportions: 'כתפיים מאוזנות',
    color_season: 'אביב חם',
    color_palette: { flatters: ['חול', 'טאופ', 'קוניאק'], avoid: ['שחור'] },
  },
  styleIdentity: { name: 'מינימל יוקרתי' },
  context: { gender: 'woman', occasion: 'סמארט' },
};

describe('selectOutfit (candidate -> score -> select)', () => {
  it('builds a top+bottom look and prefers flattering colors over avoided ones', () => {
    const input: GenerateOutfitInput = {
      ...base,
      closet: [
        { id: 't1', type: 'חולצה', color: 'חול', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
        { id: 't2', type: 'חולצה', color: 'שחור', attributes: { silhouette: 'רחב', formality: 'יומיום' } },
        { id: 'b1', type: 'מכנסיים', color: 'טאופ', attributes: { silhouette: 'רחב', formality: 'סמארט' } },
        { id: 's1', type: 'נעליים', color: 'חול' },
      ],
    };

    const selection = selectOutfit(input);
    expect(selection).not.toBeNull();
    expect(selection!.piece_ids).toContain('b1');
    expect(selection!.piece_ids).toContain('t1'); // flattering חול beats avoided שחור
    expect(selection!.piece_ids).not.toContain('t2');
    expect(selection!.score.colorPalette).toBeGreaterThan(0.5);
    expect(selection!.score.total).toBeGreaterThan(0);
  });

  it('returns null when there is no valid top+bottom or dress', () => {
    expect(selectOutfit({ ...base, closet: [] })).toBeNull();
    expect(
      selectOutfit({ ...base, closet: [{ id: 'a1', type: 'תיק', color: 'חול' }] }),
    ).toBeNull();
  });

  it('treats a dress as a complete look on its own', () => {
    const selection = selectOutfit({
      ...base,
      closet: [{ id: 'd1', type: 'שמלה', color: 'קוניאק', attributes: { formality: 'ערב' } }],
    });
    expect(selection).not.toBeNull();
    expect(selection!.piece_ids).toContain('d1');
  });
});
