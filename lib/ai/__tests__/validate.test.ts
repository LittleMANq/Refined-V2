import { describe, expect, it } from '@jest/globals';

import { ensureReasoning, parseAnalysisResult, parseGarmentTag, sanitizeNoEmDash } from '../validate';

describe('voice + contract guards', () => {
  it('strips the banned em dash (and en dash) to a comma', () => {
    expect(sanitizeNoEmDash('קו נקי — בלי מאמץ')).toBe('קו נקי, בלי מאמץ');
    expect(sanitizeNoEmDash('a–b')).toBe('a, b');
  });

  it('ensureReasoning rejects empty reasoning (the core thesis is never empty)', () => {
    expect(() => ensureReasoning('   ')).toThrow();
    expect(ensureReasoning('כי הקו מאריך אותך')).toBe('כי הקו מאריך אותך');
  });

  it('parses a valid analysis object and sanitizes em dashes inside it', () => {
    const raw = {
      body_type: 'מאוזן',
      proportions: 'כתפיים — מאוזנות',
      skin_tone: 'חם',
      color_season: 'אביב חם',
      color_palette: { flatters: ['חול'], avoid: ['שחור'] },
      extracted_items: [{ type: 'חולצה', color: 'חול' }],
      styleIdentity: { name: 'מינימל יוקרתי', description: 'נקי ומדויק' },
      bodyInsight: 'הקו הנקי מחמיא לך',
      looks: [
        { title: 'יום', description: 'רגוע' },
        { title: 'ערב', description: 'מינימלי' },
        { title: 'סופש', description: 'נעים' },
      ],
      nextItem: { item: 'בלייזר חול', why: 'משלים את הפלטה' },
    };
    const result = parseAnalysisResult(raw);
    expect(result.proportions).toBe('כתפיים, מאוזנות'); // em dash sanitized
    expect(result.looks).toHaveLength(3);
    expect(result.color_palette.flatters).toEqual(['חול']);
  });

  it('throws a structured error when required fields are missing', () => {
    expect(() => parseAnalysisResult({ body_type: 'מאוזן' })).toThrow();
    expect(() => parseAnalysisResult(null)).toThrow();
  });

  it('parses a single-garment tag (the library/camera add) into the Piece tag shape', () => {
    const tag = parseGarmentTag({
      type: "ג'ינס",
      subtype: 'סקיני',
      color: 'כחול',
      pattern: 'חלק',
      attributes: { fit: 'צמוד', silhouette: 'ישר', formality: 'יומיומי' },
    });
    expect(tag.type).toBe("ג'ינס");
    expect(tag.color).toBe('כחול');
    expect(tag.attributes?.fit).toBe('צמוד');
  });

  it('garment tag is lenient (saves with just a type) but sanitizes em dashes', () => {
    const tag = parseGarmentTag({ type: 'מעיל — ארוך' });
    expect(tag.type).toBe('מעיל, ארוך'); // em dash sanitized
    expect(tag.color).toBeUndefined(); // missing color never throws (graceful)
  });

  it('garment tag throws only when the type itself is missing', () => {
    expect(() => parseGarmentTag({ color: 'שחור' })).toThrow();
    expect(() => parseGarmentTag(null)).toThrow();
  });
});
