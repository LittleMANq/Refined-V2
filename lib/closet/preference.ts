import type { Outfit, Piece, PreferenceProfile } from '../data';

/**
 * Derive the lightweight `preference_profile` from the user's accumulated save /
 * dismiss signal. Saved looks are positive (the user kept them); dismissed looks
 * are negative. We tally each look's pieces' colors and silhouettes, keep the
 * net-positive ones as "favored", and lean `formality_bias` toward the formality
 * of kept looks. Onboarding seeds (palette colors, taste silhouettes) are kept as a
 * baseline tail unless explicitly dismissed, so the profile refines, never resets.
 *
 * Simple and explainable by design: "your favored colors are the ones that show up
 * in looks you keep, minus ones you pass on." It can grow richer later (wear data,
 * recency weighting) without changing this contract.
 */

const MAX = 6; // keep each favored list short, so it biases without dominating

// Minimal formality keyword -> rank, local to keep this client-side module free of
// the Deno-flavored pipeline import. Mirrors the pipeline's ranking intent.
const FORMALITY_KEYS: { keys: string[]; rank: number }[] = [
  { keys: ['casual', 'relaxed', 'יומיום', 'קזואל', "קז'ואל"], rank: 1 },
  { keys: ['smart', 'סמארט'], rank: 2 },
  { keys: ['business', 'office', 'עסקי', 'משרד', 'עבודה'], rank: 3 },
  { keys: ['formal', 'evening', 'רשמי', 'ערב', 'אירוע'], rank: 4 },
];

function formalityRank(formality: string | null | undefined): number | null {
  const f = (formality ?? '').toLowerCase();
  if (!f) return null;
  for (const { keys, rank } of FORMALITY_KEYS) {
    if (keys.some((k) => f.includes(k))) return rank;
  }
  return null;
}

const norm = (s: string) => s.toLowerCase().trim();

/** Only the fields the derivation reads (so callers and tests stay light). */
type SignalOutfit = Pick<Outfit, 'piece_ids' | 'saved' | 'dismissed'>;
type SignalPiece = Pick<Piece, 'id' | 'color' | 'attributes'>;

export function derivePreferenceProfile(
  outfits: SignalOutfit[],
  pieces: SignalPiece[],
  base?: PreferenceProfile | null,
): PreferenceProfile {
  const byId = new Map(pieces.map((p) => [p.id, p]));
  const colorNet = new Map<string, number>();
  const silNet = new Map<string, number>();
  const colorLabel = new Map<string, string>(); // normalized key -> original label
  const silLabel = new Map<string, string>();
  let formSum = 0;
  let formCount = 0;

  const bump = (
    net: Map<string, number>,
    label: Map<string, string>,
    value: string | null | undefined,
    delta: number,
  ) => {
    if (!value || !value.trim()) return;
    const key = norm(value);
    net.set(key, (net.get(key) ?? 0) + delta);
    if (!label.has(key)) label.set(key, value.trim());
  };

  for (const o of outfits) {
    const positive = o.saved === true;
    const negative = o.dismissed === true;
    if (!positive && !negative) continue;
    const delta = positive ? 1 : -1;
    for (const id of o.piece_ids ?? []) {
      const p = byId.get(id);
      if (!p) continue;
      bump(colorNet, colorLabel, p.color, delta);
      bump(silNet, silLabel, p.attributes?.silhouette, delta);
      if (positive) {
        const r = formalityRank(p.attributes?.formality);
        if (r != null) {
          formSum += r;
          formCount += 1;
        }
      }
    }
  }

  // Net-positive entries (favored), strongest first; then onboarding-seed entries
  // that were not dismissed, as a baseline tail. Dismissed entries are excluded.
  const merge = (net: Map<string, number>, label: Map<string, string>, baseArr?: string[]): string[] => {
    const positives = [...net.entries()]
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => label.get(k) as string);
    const negativeKeys = new Set([...net.entries()].filter(([, v]) => v < 0).map(([k]) => k));
    const out = [...positives];
    for (const c of baseArr ?? []) {
      if (!negativeKeys.has(norm(c)) && !out.some((r) => norm(r) === norm(c))) out.push(c);
    }
    return out.slice(0, MAX);
  };

  const baseBias = base?.formality_bias ?? 2;
  const formality_bias = formCount
    ? Number((baseBias * 0.5 + (formSum / formCount) * 0.5).toFixed(2)) // drift halfway toward kept looks
    : baseBias;

  return {
    favored_colors: merge(colorNet, colorLabel, base?.favored_colors),
    favored_silhouettes: merge(silNet, silLabel, base?.favored_silhouettes),
    formality_bias,
  };
}
