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

  it('still builds a simpler look from a thin, sparsely-tagged closet (tier 2)', () => {
    const selection = selectOutfit({
      ...base,
      closet: [
        { id: 'x1', type: 'חולצה', color: 'חול' },
        { id: 'x2', type: null, color: 'טאופ' }, // untagged -> flexible body piece
        { id: 'sh1', type: 'נעליים', color: 'קוניאק' },
      ],
    });
    expect(selection).not.toBeNull();
    expect(selection!.piece_ids).toContain('x1');
    expect(selection!.piece_ids).toContain('x2');
  });

  it('builds a look from two untagged pieces rather than giving up', () => {
    const selection = selectOutfit({
      ...base,
      closet: [
        { id: 'u1', type: null, color: 'חול' },
        { id: 'u2', type: null, color: 'טאופ' },
      ],
    });
    expect(selection).not.toBeNull();
  });

  it('treats a dress as a complete look on its own', () => {
    const selection = selectOutfit({
      ...base,
      closet: [{ id: 'd1', type: 'שמלה', color: 'קוניאק', attributes: { formality: 'ערב' } }],
    });
    expect(selection).not.toBeNull();
    expect(selection!.piece_ids).toContain('d1');
  });

  it('a work-meeting occasion bumps formality and pulls in outerwear', () => {
    const selection = selectOutfit({
      ...base,
      context: { gender: 'woman', occasion: 'פגישת עבודה' },
      closet: [
        { id: 't1', type: 'חולצה', color: 'שמנת', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
        { id: 'b1', type: 'מכנסיים', color: 'טאופ', attributes: { silhouette: 'ישר', formality: 'סמארט' } },
        { id: 'o1', type: 'בלייזר', color: 'חול', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
        { id: 'sh1', type: 'נעליים', color: 'קוניאק' },
      ],
    });
    expect(selection).not.toBeNull();
    expect(selection!.piece_ids).toContain('o1');
  });

  it('biases selection toward learned favored colors (before/after)', () => {
    // Neutral palette so the two tops differ only by color; both equally valid.
    const neutral = { ...base, analysis: { color_palette: { flatters: [], avoid: [] } } };
    const closet = [
      { id: 'tA', type: 'חולצה', color: 'כחול', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
      { id: 'tB', type: 'חולצה', color: 'ירוק', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
      { id: 'b1', type: 'מכנסיים', color: 'טאופ', attributes: { silhouette: 'ישר', formality: 'סמארט' } },
      { id: 's1', type: 'נעליים', color: 'אפור' },
    ];

    const before = selectOutfit({ ...neutral, closet });
    const after = selectOutfit({ ...neutral, preferences: { favored_colors: ['ירוק'] }, closet });

    expect(before!.piece_ids).toContain('tA'); // a tie with no preference -> first candidate
    expect(after!.piece_ids).toContain('tB'); // favoring ירוק flips the choice
    expect(after!.score.preference).toBeGreaterThan(before!.score.preference); // measurable bias
  });

  it('keeps preference a bias, not a filter (palette merit still wins)', () => {
    const closet = [
      { id: 'tFav', type: 'חולצה', color: 'ירוק', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
      { id: 'tFlat', type: 'חולצה', color: 'חול', attributes: { silhouette: 'מחויט', formality: 'סמארט' } },
      { id: 'b1', type: 'מכנסיים', color: 'טאופ', attributes: { silhouette: 'ישר', formality: 'סמארט' } },
      { id: 's1', type: 'נעליים', color: 'קוניאק' },
    ];
    // Palette strongly flatters חול and avoids ירוק, but the user "favors" ירוק.
    const selection = selectOutfit({
      ...base,
      analysis: { color_palette: { flatters: ['חול', 'טאופ', 'קוניאק'], avoid: ['ירוק'] } },
      preferences: { favored_colors: ['ירוק'] },
      closet,
    });
    // The flattering look still wins: preference nudges, it does not override merit.
    expect(selection!.piece_ids).toContain('tFlat');
    expect(selection!.piece_ids).not.toContain('tFav');
  });
});
