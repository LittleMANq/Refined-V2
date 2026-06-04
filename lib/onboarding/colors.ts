/**
 * The analysis engine returns personal-palette colors as Hebrew (or English) NAMES.
 * To render real swatches we map known warm-neutral names to a representative hex.
 * These are depictions of the user's actual clothing colors, not UI theme colors:
 * the whole product is personal color, so showing it is the point. The map is warm
 * neutrals only (on brand: no green, no purple). Unknown names render as a named
 * chip instead of a guessed swatch.
 */
const SWATCHES: { keys: string[]; hex: string }[] = [
  { keys: ['שמנת', 'קרם', 'cream', 'שנהב', 'ivory', 'לבן שמנת'], hex: '#F3ECE0' },
  { keys: ['חול', 'חולי', "בז'", 'בז', 'beige', 'sand', 'אבן', 'stone'], hex: '#E2D4BE' },
  { keys: ['טאופ', 'taupe', 'אגוז', 'almond', 'שקד'], hex: '#C9B69C' },
  { keys: ['קאמל', 'גמל', 'camel', 'חרדל', 'mustard', 'דבש', 'honey'], hex: '#C49A66' },
  { keys: ['זהב עתיק', 'זהב', 'gold', 'ברונזה', 'bronze', 'חמרה', 'אוקר', 'ochre'], hex: '#B08953' },
  { keys: ['קוניאק', 'cognac', 'קרמל', 'caramel', 'טרקוטה', 'terracotta', 'חמרה אדמה'], hex: '#A06A45' },
  { keys: ['חום אדמה', 'אדמה', 'rust', 'חלודה', 'קינמון', 'cinnamon', 'נחושת', 'copper'], hex: '#8C6B4F' },
  { keys: ['חום', 'brown', 'שוקולד', 'chocolate', 'ערמון', 'מוקה', 'mocha', 'walnut', 'אגוז כהה'], hex: '#5E4733' },
  { keys: ['אספרסו', 'espresso', 'חום כהה', 'דארק'], hex: '#3A322B' },
  { keys: ['פחם', 'charcoal', 'אפור פחם', 'גרפיט', 'graphite'], hex: '#3B3A38' },
  { keys: ['אפור', 'gray', 'grey', 'מלט', 'cement'], hex: '#9A938B' },
  { keys: ['שחור', 'black', 'אוניקס', 'onyx'], hex: '#1B1714' },
  { keys: ['לבן', 'white', 'חלב', 'milk', 'בהט'], hex: '#FBF8F3' },
];

/** Representative hex for a palette color name, or null if it is not a known warm neutral. */
export function paletteSwatch(name: string): string | null {
  const v = name.toLowerCase().replace(/["'`]/g, '').trim();
  if (!v) return null;
  for (const { keys, hex } of SWATCHES) {
    for (const k of keys) {
      const kk = k.toLowerCase().replace(/["'`]/g, '').trim();
      if (v.includes(kk) || kk.includes(v)) return hex;
    }
  }
  return null;
}
