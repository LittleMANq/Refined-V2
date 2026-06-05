import type {
  ClosetPiece,
  GenerateOutfitInput,
  OutfitScore,
  OutfitSelection,
} from './types.ts';

/**
 * The deterministic part of the pipeline: ANALYSE -> candidate -> score -> select.
 * The final REASON step is the LLM (server-side), which explains the chosen look.
 * Heuristic v1: transparent, degrades gracefully when piece data is sparse
 * (unknown dimensions score a neutral 0.5 rather than guessing).
 */

type Category = 'top' | 'bottom' | 'dress' | 'outer' | 'shoes' | 'accessory' | 'other';

const CATEGORY_KEYWORDS: Record<Exclude<Category, 'other'>, string[]> = {
  dress: ['dress', 'gown', 'jumpsuit', 'overall', 'שמלה', 'אוברול', 'סרבל'],
  outer: ['jacket', 'coat', 'blazer', 'cardigan', 'מעיל', 'זקט', 'גקט', 'בלייזר', 'קרדיגן'],
  shoes: ['shoe', 'boot', 'sneaker', 'heel', 'sandal', 'נעל', 'מגף', 'סניקרס', 'עקב', 'סנדל'],
  accessory: ['bag', 'belt', 'scarf', 'hat', 'תיק', 'חגורה', 'צעיף', 'כובע'],
  top: ['top', 'shirt', 'tee', 'blouse', 'sweater', 'knit', 'hoodie', 'חולצה', 'טופ', 'סוודר', 'סריג', 'גופייה'],
  bottom: ['bottom', 'pant', 'trouser', 'jean', 'skirt', 'short', 'מכנס', 'גינס', 'גי', 'חצאית', 'שורט'],
};

const CATEGORY_ORDER: Exclude<Category, 'other'>[] = [
  'dress',
  'outer',
  'shoes',
  'accessory',
  'top',
  'bottom',
];

function categorize(piece: ClosetPiece): Category {
  const hay = `${piece.type ?? ''} ${piece.subtype ?? ''}`.toLowerCase();
  for (const cat of CATEGORY_ORDER) {
    if (CATEGORY_KEYWORDS[cat].some((k) => hay.includes(k))) return cat;
  }
  return 'other';
}

const FORMALITY_RANK: { keys: string[]; rank: number }[] = [
  { keys: ['casual', 'relaxed', 'יומיום', 'קזואל', "קז'ואל"], rank: 1 },
  { keys: ['smart', 'סמארט'], rank: 2 },
  { keys: ['business', 'office', 'עסקי', 'משרד', 'עבודה'], rank: 3 },
  { keys: ['formal', 'evening', 'רשמי', 'ערב', 'אירוע'], rank: 4 },
];

function formalityRank(piece: ClosetPiece): number | null {
  const f = (piece.attributes?.formality ?? '').toLowerCase();
  if (!f) return null;
  for (const { keys, rank } of FORMALITY_RANK) {
    if (keys.some((k) => f.includes(k))) return rank;
  }
  return null;
}

function occasionTarget(occasion?: string): number {
  const o = (occasion ?? '').toLowerCase();
  for (const { keys, rank } of FORMALITY_RANK) {
    if (keys.some((k) => o.includes(k))) return rank;
  }
  return 2; // smart-casual default
}

function matchesAny(value: string | null | undefined, list: string[]): boolean {
  if (!value) return false;
  const v = value.toLowerCase().trim();
  return list.some((c) => {
    const cc = c.toLowerCase().trim();
    return v.includes(cc) || cc.includes(v);
  });
}

interface Candidate {
  pieces: ClosetPiece[];
}

function buildCandidates(closet: ClosetPiece[], targetFormality: number): Candidate[] {
  const by: Record<Category, ClosetPiece[]> = {
    top: [],
    bottom: [],
    dress: [],
    outer: [],
    shoes: [],
    accessory: [],
    other: [],
  };
  for (const p of closet) by[categorize(p)].push(p);

  const shoe = by.shoes[0];
  const outer = by.outer[0];
  const wantOuter = targetFormality >= 3 && !!outer;

  const finish = (base: ClosetPiece[]): Candidate => {
    const pieces = [...base];
    if (shoe) pieces.push(shoe);
    if (wantOuter && outer) pieces.push(outer);
    return { pieces };
  };

  // Tier 1 — complete looks: a dress on its own, or a top paired with a bottom.
  // This is the preferred shape and the only tier a healthy closet ever needs.
  const tier1: Candidate[] = [];
  for (const dress of by.dress) tier1.push(finish([dress]));
  for (const top of by.top) {
    for (const bottom of by.bottom) {
      tier1.push(finish([top, bottom]));
      if (tier1.length >= 60) return tier1; // bound the search
    }
  }
  if (tier1.length) return tier1;

  // Tier 2 — simpler-but-valid looks for a thin or sparsely-tagged closet, so we
  // deliver a real look from as few as ~4-5 pieces instead of dropping to the
  // empty state (the cold-start cliff). An 'other' piece (a real garment the
  // tagger did not recognize) is treated as a flexible body piece. A pair only
  // forms an upper+lower look, never two tops or two bottoms.
  const body = [...by.top, ...by.bottom, ...by.other];
  const isTop = (p: ClosetPiece) => by.top.includes(p);
  const isBottom = (p: ClosetPiece) => by.bottom.includes(p);
  const tier2: Candidate[] = [];
  for (let i = 0; i < body.length; i++) {
    for (let j = i + 1; j < body.length; j++) {
      const a = body[i];
      const b = body[j];
      if (isTop(a) && isTop(b)) continue;
      if (isBottom(a) && isBottom(b)) continue;
      tier2.push(finish([a, b]));
      if (tier2.length >= 60) return tier2;
    }
  }
  if (tier2.length) return tier2;

  // Last resort — a single body piece is still a presentable look once it is
  // finished with shoes and/or an outer layer (at least two garments together).
  if (body.length && (shoe || outer)) {
    const pieces = [body[0]];
    if (shoe) pieces.push(shoe);
    if (outer) pieces.push(outer);
    return [{ pieces }];
  }
  return [];
}

function scoreColorPalette(pieces: ClosetPiece[], input: GenerateOutfitInput): number {
  const palette = input.analysis.color_palette;
  if (!palette) return 0.5;
  let s = 0.5;
  for (const p of pieces) {
    if (matchesAny(p.color, palette.flatters)) s += 0.15;
    if (matchesAny(p.color, palette.avoid)) s -= 0.2;
  }
  return Math.max(0, Math.min(1, s));
}

function scoreProportion(pieces: ClosetPiece[]): number {
  const sil = pieces.map((p) => (p.attributes?.silhouette ?? '').toLowerCase()).filter(Boolean);
  if (sil.length === 0) return 0.5;
  const fitted = sil.some((s) => /fitted|slim|צמוד|מחויט|מותאם/.test(s));
  const relaxed = sil.some((s) => /relaxed|oversize|wide|רחב|נופל|אוברסייז/.test(s));
  return fitted && relaxed ? 0.9 : 0.65; // balance reads best
}

function scoreSilhouette(pieces: ClosetPiece[]): number {
  const known = pieces.filter((p) => p.attributes?.silhouette).length;
  return 0.5 + 0.3 * (known / pieces.length); // reward coherent, described silhouettes
}

function scoreFormality(pieces: ClosetPiece[], target: number): number {
  const ranks = pieces.map(formalityRank).filter((r): r is number => r != null);
  if (ranks.length === 0) return 0.5;
  const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length;
  const spread = Math.max(...ranks) - Math.min(...ranks);
  const matchTarget = 1 - Math.min(1, Math.abs(avg - target) / 3);
  const coherence = 1 - Math.min(1, spread / 3);
  return 0.5 * matchTarget + 0.5 * coherence;
}

function scoreConsistency(pieces: ClosetPiece[]): number {
  const seasons = new Set(pieces.map((p) => (p.season ?? '').toLowerCase()).filter(Boolean));
  const ranks = new Set(pieces.map(formalityRank).filter((r): r is number => r != null));
  const seasonCoherent = seasons.size <= 1 ? 1 : 0.6;
  const formalityCoherent = ranks.size <= 1 ? 1 : 0.7;
  return 0.5 * seasonCoherent + 0.5 * formalityCoherent;
}

const WEIGHTS = {
  colorPalette: 0.35,
  proportion: 0.2,
  silhouette: 0.15,
  formality: 0.2,
  consistency: 0.1,
};

function scoreCandidate(candidate: Candidate, input: GenerateOutfitInput): OutfitScore {
  const target = occasionTarget(input.context.occasion);
  const colorPalette = scoreColorPalette(candidate.pieces, input);
  const proportion = scoreProportion(candidate.pieces);
  const silhouette = scoreSilhouette(candidate.pieces);
  const formality = scoreFormality(candidate.pieces, target);
  const consistency = scoreConsistency(candidate.pieces);
  const total =
    colorPalette * WEIGHTS.colorPalette +
    proportion * WEIGHTS.proportion +
    silhouette * WEIGHTS.silhouette +
    formality * WEIGHTS.formality +
    consistency * WEIGHTS.consistency;
  return {
    total: Number(total.toFixed(4)),
    colorPalette: Number(colorPalette.toFixed(3)),
    proportion: Number(proportion.toFixed(3)),
    silhouette: Number(silhouette.toFixed(3)),
    formality: Number(formality.toFixed(3)),
    consistency: Number(consistency.toFixed(3)),
  };
}

/**
 * Run candidate -> score -> select over the closet. Returns the best look, or
 * null when there are not enough pieces to form one (caller returns a structured
 * "need more pieces" response, never crashes).
 */
export function selectOutfit(input: GenerateOutfitInput): OutfitSelection | null {
  const target = occasionTarget(input.context.occasion);
  const candidates = buildCandidates(input.closet, target);
  if (candidates.length === 0) return null;

  let best: { candidate: Candidate; score: OutfitScore } | null = null;
  for (const candidate of candidates) {
    const score = scoreCandidate(candidate, input);
    if (!best || score.total > best.score.total) best = { candidate, score };
  }
  if (!best) return null;

  return {
    piece_ids: best.candidate.pieces.map((p) => p.id),
    score: best.score,
  };
}
