import type {
  AnalysisResult,
  DetectedGarment,
  DetectGarmentsResult,
  GarmentRegion,
  GarmentTag,
} from '../analysis/types.ts';

/**
 * Output guards. The model is instructed to return clean JSON / Hebrew text, but
 * these are the safety net: extract JSON robustly, validate the contract, and
 * strip the one fingerprint we never allow (the em dash). On bad input they throw
 * a clear error so the caller can return a structured failure, never crash.
 */

/** Replace em/en dashes with a comma. The em dash is a hard ban (CLAUDE.md). */
export function sanitizeNoEmDash(text: string): string {
  return text.replace(/\s*[—–]\s*/g, ', ');
}

/** Pull the first balanced JSON object out of a model response (handles ```json fences). */
export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in model output');
  }
  return JSON.parse(body.slice(start, end + 1));
}

function str(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid analysis output: "${field}" must be a non-empty string`);
  }
  return sanitizeNoEmDash(value.trim());
}

function optStr(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? sanitizeNoEmDash(value.trim()) : undefined;
}

function strArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string').map((v) => sanitizeNoEmDash(v.trim()));
}

function num01(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.min(1, Math.max(0, value));
}

/** Parse a normalized 0..1 bounding region; undefined if absent or degenerate. */
function parseRegion(value: unknown): GarmentRegion | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const r = value as Record<string, unknown>;
  const x = num01(r.x);
  const y = num01(r.y);
  const width = num01(r.width);
  const height = num01(r.height);
  if (x === undefined || y === undefined || width === undefined || height === undefined) return undefined;
  if (width <= 0 || height <= 0) return undefined;
  return { x, y, width, height };
}

/** Validate + normalize the analysis JSON into a typed AnalysisResult. */
export function parseAnalysisResult(raw: unknown): AnalysisResult {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid analysis output: not an object');
  }
  const r = raw as Record<string, unknown>;
  const palette = (r.color_palette ?? {}) as Record<string, unknown>;
  const identity = (r.styleIdentity ?? {}) as Record<string, unknown>;
  const next = (r.nextItem ?? {}) as Record<string, unknown>;

  const looksRaw = Array.isArray(r.looks) ? r.looks : [];
  const looks = looksRaw.slice(0, 3).map((l) => {
    const lo = (l ?? {}) as Record<string, unknown>;
    return { title: str(lo.title, 'looks[].title'), description: str(lo.description, 'looks[].description') };
  });
  if (looks.length !== 3) {
    throw new Error(`Invalid analysis output: expected 3 looks, got ${looks.length}`);
  }

  const itemsRaw = Array.isArray(r.extracted_items) ? r.extracted_items : [];
  const extracted_items = itemsRaw.map((i) => {
    const io = (i ?? {}) as Record<string, unknown>;
    const attrs = (io.attributes ?? {}) as Record<string, unknown>;
    return {
      type: str(io.type, 'extracted_items[].type'),
      color: optStr(io.color),
      pattern: optStr(io.pattern),
      attributes: {
        fit: optStr(attrs.fit),
        silhouette: optStr(attrs.silhouette),
        formality: optStr(attrs.formality),
      },
      bounding_region: parseRegion(io.bounding_region),
    };
  });

  return {
    body_type: str(r.body_type, 'body_type'),
    proportions: str(r.proportions, 'proportions'),
    skin_tone: str(r.skin_tone, 'skin_tone'),
    color_season: str(r.color_season, 'color_season'),
    contrast: optStr(r.contrast),
    color_palette: {
      flatters: strArray(palette.flatters),
      avoid: strArray(palette.avoid),
    },
    extracted_items,
    styleIdentity: {
      name: str(identity.name, 'styleIdentity.name'),
      description: str(identity.description, 'styleIdentity.description'),
    },
    bodyInsight: str(r.bodyInsight, 'bodyInsight'),
    looks,
    nextItem: {
      item: str(next.item, 'nextItem.item'),
      why: str(next.why, 'nextItem.why'),
    },
  };
}

/**
 * Validate + normalize the single-garment tag JSON into a typed GarmentTag.
 * Lenient on purpose: `type` is required (a piece must read as something), but a
 * missing color / pattern / attribute never throws, so a partly-tagged garment
 * still saves gracefully instead of crashing the add.
 */
export function parseGarmentTag(raw: unknown): GarmentTag {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid garment tag output: not an object');
  }
  const r = raw as Record<string, unknown>;
  const attrs = (r.attributes ?? {}) as Record<string, unknown>;
  return {
    type: str(r.type, 'type'),
    subtype: optStr(r.subtype),
    color: optStr(r.color),
    pattern: optStr(r.pattern),
    attributes: {
      fit: optStr(attrs.fit),
      silhouette: optStr(attrs.silhouette),
      formality: optStr(attrs.formality),
    },
  };
}

/**
 * Validate + normalize the multi-garment detection JSON. Resilient: a malformed
 * entry is skipped (not fatal), so one bad item never sinks the whole detection.
 * An empty list is valid (the caller falls back to a manual add).
 */
export function parseDetectedGarments(raw: unknown): DetectGarmentsResult {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid detection output: not an object');
  }
  const r = raw as Record<string, unknown>;
  const list = Array.isArray(r.garments) ? r.garments : [];
  const garments: DetectedGarment[] = [];
  for (const g of list) {
    const go = (g ?? {}) as Record<string, unknown>;
    let type: string;
    try {
      type = str(go.type, 'garments[].type');
    } catch {
      continue; // skip an entry with no usable type
    }
    const attrs = (go.attributes ?? {}) as Record<string, unknown>;
    garments.push({
      label: optStr(go.label) ?? type,
      type,
      color: optStr(go.color),
      pattern: optStr(go.pattern),
      attributes: {
        fit: optStr(attrs.fit),
        silhouette: optStr(attrs.silhouette),
        formality: optStr(attrs.formality),
      },
      bounding_region: parseRegion(go.bounding_region),
    });
  }
  return { garments };
}

/** The outfit reasoning is the core thesis and must never be empty. */
export function ensureReasoning(text: string): string {
  const clean = sanitizeNoEmDash(text).trim();
  if (!clean) throw new Error('Reasoning generation returned empty text');
  return clean;
}
