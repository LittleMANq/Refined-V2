import type { AnalysisContext, Gender } from '../../analysis/types.ts';
import type {
  ChatMessage,
  ClosetPiece,
  GenerateOutfitInput,
  OutfitSelection,
  StylistChatInput,
} from '../types.ts';
import { voiceRules } from '../voice.ts';

/**
 * Production prompts for the AI engines. Versioned, single source of truth.
 * Each system prompt embeds the Refined voice rules + the exact output contract.
 * The model instruction is plain English; the OUTPUT is always Hebrew.
 */
export const PROMPT_VERSION = '1.0.0';

const ANALYSIS_JSON_CONTRACT = `Return ONE JSON object and nothing else (no markdown, no backticks). Shape:
{
  "body_type": "string",
  "proportions": "string (shoulder/waist/hip balance, build, in one short phrase)",
  "skin_tone": "string (Hebrew only: חם / קריר / נייטרלי)",
  "color_season": "string (e.g. אביב חם)",
  "contrast": "string (Hebrew only: נמוך / בינוני / גבוה)",
  "color_palette": { "flatters": ["שם צבע"], "avoid": ["שם צבע"] },
  "extracted_items": [
    { "type": "string", "color": "string", "pattern": "string",
      "attributes": { "fit": "string", "silhouette": "string", "formality": "string" },
      "bounding_region": { "x": 0.0, "y": 0.0, "width": 0.0, "height": 0.0 } }
  ],
  "styleIdentity": { "name": "string (2-3 words)", "description": "string (one warm sentence)" },
  "bodyInsight": "string (ONE sharp, practical, affirming sentence. Not a list.)",
  "looks": [
    { "title": "string", "description": "string (one short why this works for them)" }
  ],
  "nextItem": { "item": "string", "why": "string (why it is worth buying for them)" }
}
Rules: exactly 3 looks. EVERY value is in Hebrew, including skin_tone and contrast (never English words like "warm" or "low"). Every Hebrew value must follow the voice rules above. color_palette is warm muted neutrals that suit their coloring (no green, no purple). bounding_region is each extracted garment's box in NORMALIZED coordinates 0..1 (x,y = top-left corner; width,height = size), relative to the whole photo, so it can be cropped out.`;

/** Vision analysis prompt: the personal-analysis magic moment. */
export function buildAnalysisPrompt(context: AnalysisContext): { system: string; instruction: string } {
  const system = [
    'אתה סטייליסט אישי יוקרתי. אתה מנתח את האדם קודם (מבנה גוף, פרופורציות, גוון עור ועונת צבע), ורק אחר כך את הבגדים.',
    '',
    voiceRules(context.gender),
    '',
    ANALYSIS_JSON_CONTRACT,
  ].join('\n');

  const contextLines: string[] = [];
  if (context.styleContext) contextLines.push(`Style context: ${context.styleContext}.`);
  if (context.archetypes?.length) contextLines.push(`Chosen archetypes: ${context.archetypes.join(', ')}.`);
  if (context.taste) contextLines.push(`Taste note: ${context.taste}.`);

  const instruction = [
    'Look at the attached full-body photo(s) of ONE person.',
    'First analyse the person: body type and proportions, skin tone and color season with contrast level.',
    'Then detect the garments visible in the photo(s) and list them as extracted_items, auto-tagged.',
    'Then synthesise: a named Style Identity, one sharp affirming body insight (a single practical sentence), three first looks (each a title and a short why), and one next item worth buying (with the why).',
    'Base the color palette on their natural coloring. Explain every recommendation. Output Hebrew values only.',
    ...contextLines,
  ].join('\n');

  return { system, instruction };
}

const GARMENT_TAG_JSON_CONTRACT = `Return ONE JSON object and nothing else (no markdown, no backticks). Shape:
{
  "type": "string (Hebrew, the garment category, e.g. ג'ינס / חולצה / שמלה / נעליים / מעיל)",
  "subtype": "string (Hebrew, optional finer label, e.g. סקיני / מכופתרת / מידי; empty string if unsure)",
  "color": "string (Hebrew color name, the dominant color, e.g. כחול / שחור / חול / קוניאק)",
  "pattern": "string (Hebrew, e.g. חלק / פסים / משבצות / פרחוני; use חלק if it is solid)",
  "attributes": { "fit": "string (Hebrew)", "silhouette": "string (Hebrew)", "formality": "string (Hebrew)" }
}
Rules: EVERY value is in Hebrew (never English words). "type" and "color" are required and must never be empty. Keep each value short, one or two words. Follow the voice rules above. No em dash.`;

const DETECT_GARMENTS_JSON_CONTRACT = `Return ONE JSON object and nothing else (no markdown, no backticks). Shape:
{
  "garments": [
    {
      "label": "string (Hebrew, short, e.g. ג'ינס כחול / חולצה לבנה)",
      "type": "string (Hebrew garment category, e.g. ג'ינס / חולצה / שמלה / נעליים)",
      "color": "string (Hebrew, the SINGLE dominant color of the garment fabric, e.g. שחור / לבן / כחול / כחול כהה / ירוק כהה / חום / בז' / בורדו)",
      "pattern": "string (Hebrew; חלק if solid)",
      "attributes": { "fit": "string", "silhouette": "string", "formality": "string" },
      "bounding_region": { "x": 0.0, "y": 0.0, "width": 0.0, "height": 0.0 }
    }
  ]
}
Rules: detect each DISTINCT wearable garment in the photo (top, bottom, dress, outerwear, shoes, bag). Do NOT return the body, skin, hair, or background as items. EVERY user-facing value is in Hebrew (never English). bounding_region is the garment's box in NORMALIZED coordinates 0..1 (x,y = top-left corner; width,height = size), relative to the whole photo. Follow the voice rules above. No em dash. If the photo has no clear garment, return "garments": [].
COLOR ACCURACY (important): report each garment's TRUE dominant color as it appears on the fabric itself, ignoring lighting, shadow, screen tint and the background. Look carefully before naming it. Use exactly ONE real color name. If the shade sits between two colors, pick the single closest real color, never invent a hyphenated blend (for example do not write "כחול-אפור"). Name the actual hue: a dark green is "ירוק כהה" (not blue, not grey), a navy is "כחול כהה", an olive is "ירוק זית". Be accurate and conservative, if you are unsure prefer the plainest correct color name.`;

/** Multi-garment detection prompt: one photo in, a list of garments (with regions) out. */
export function buildDetectGarmentsPrompt(gender: Gender): { system: string; instruction: string } {
  const system = [
    'אתה סטייליסט אישי יוקרתי. אתה מזהה את כל פריטי הלבוש המובחנים בתוך תמונה (גם תמונת גוף מלא) ומתייג כל אחד בנפרד.',
    '',
    voiceRules(gender),
    '',
    DETECT_GARMENTS_JSON_CONTRACT,
  ].join('\n');

  const instruction = [
    'Look at the attached photo. List every distinct wearable garment you can see.',
    'For each garment give its Hebrew label, type, dominant color, pattern, fit / silhouette / formality, and its bounding_region as normalized 0..1 coordinates over the whole photo.',
    'Read each color carefully and conservatively: the real dominant color of the fabric itself, one single real color name, never a hyphenated blend. A dark green is ירוק כהה, not blue or grey.',
    'Ignore the person, skin, hair and background. Output Hebrew values only.',
  ].join('\n');

  return { system, instruction };
}

/** Single-garment tagging prompt: one item photo in, Piece tags out. */
export function buildGarmentTagPrompt(gender: Gender): { system: string; instruction: string } {
  const system = [
    'אתה סטייליסט אישי יוקרתי. אתה מזהה פריט לבוש בודד מתוך תמונה (פריט שטוח או פריט לבוש יחיד) ומתייג אותו במדויק.',
    '',
    voiceRules(gender),
    '',
    GARMENT_TAG_JSON_CONTRACT,
  ].join('\n');

  const instruction = [
    'Look at the attached photo of ONE garment (a flat-lay, or a single worn item).',
    'Identify the single main garment and tag it: its type, an optional finer subtype, its dominant color, its pattern, and fit / silhouette / formality.',
    'If more than one item is visible, tag only the most prominent garment.',
    'Output Hebrew values only.',
  ].join('\n');

  return { system, instruction };
}

function pieceLine(p: ClosetPiece): string {
  const bits = [p.type, p.subtype, p.color, p.pattern, p.attributes?.silhouette, p.attributes?.formality]
    .filter(Boolean)
    .join(', ');
  return `- ${bits || p.id}`;
}

/** Reasoning prompt for a selected outfit (STEP 4: REASON). Output is plain Hebrew text. */
export function buildOutfitReasoningPrompt(
  input: GenerateOutfitInput,
  selection: OutfitSelection,
): { system: string; instruction: string } {
  const chosen = selection.piece_ids
    .map((id) => input.closet.find((p) => p.id === id))
    .filter((p): p is ClosetPiece => !!p);

  const system = [
    'אתה הסטייליסט האישי של המשתמש. אתה מסביר למה הלוק הזה עובד עבורו, בחום ובדיוק.',
    '',
    voiceRules(input.context.gender),
    '',
    'כתוב פסקה אחת קצרה (שניים עד שלושה משפטים). אל תשתמש ברשימה. התייחס לפרופורציות, לפלטת הצבעים ולהקשר (האירוע). בלי קו מפריד.',
  ].join('\n');

  const a = input.analysis;
  const instruction = [
    `Style identity: ${input.styleIdentity.name}.`,
    a.proportions ? `Proportions: ${a.proportions}.` : '',
    a.color_season ? `Color season: ${a.color_season}.` : '',
    a.color_palette ? `Flattering colors: ${a.color_palette.flatters.join(', ')}.` : '',
    `Occasion: ${input.context.occasion ?? 'יומיום'}.`,
    'The chosen look (explain why THESE pieces work together for this person and this moment):',
    ...chosen.map(pieceLine),
    'Write only the Hebrew reasoning paragraph, nothing else.',
  ]
    .filter(Boolean)
    .join('\n');

  return { system, instruction };
}

function analysisSummary(input: StylistChatInput): string {
  const a = input.analysis;
  if (!a) return '';
  const lines = [
    a.proportions ? `פרופורציות: ${a.proportions}` : '',
    a.color_season ? `עונת צבע: ${a.color_season}` : '',
    a.color_palette ? `צבעים שמחמיאים: ${a.color_palette.flatters.join(', ')}` : '',
    input.styleIdentity ? `זהות סטייל: ${input.styleIdentity.name}` : '',
  ].filter(Boolean);
  return lines.length ? `מה שאתה יודע על המשתמש:\n${lines.join('\n')}` : '';
}

function closetSummary(input: StylistChatInput): string {
  if (!input.closet?.length) return '';
  const lines = input.closet.slice(0, 40).map(pieceLine);
  return `הארון של המשתמש (התייחס לפריטים אמיתיים מתוכו):\n${lines.join('\n')}`;
}

/** Stylist chat prompt: wardrobe- and body-aware conversation. */
export function buildChatPrompt(input: StylistChatInput): { system: string; messages: ChatMessage[] } {
  const gender = input.context?.gender ?? 'unspecified';
  const system = [
    'אתה הסטייליסט האישי של המשתמש בתוך אפליקציית Refined. אתה מכיר את הגוף שלו, את פלטת הצבעים שלו ואת הארון שלו. אתה לא צ\'אטבוט גנרי.',
    '',
    voiceRules(gender),
    '',
    analysisSummary(input),
    '',
    closetSummary(input),
    '',
    'ענה בקצרה ובחום. בסס את העצה על הגוף, הפלטה והפריטים האמיתיים של המשתמש. תמיד הסבר את הלמה.',
  ]
    .filter(Boolean)
    .join('\n');

  const messages: ChatMessage[] = input.messages.map((m) => ({ role: m.role, content: m.content }));
  return { system, messages };
}
