/**
 * The analysis engine boundary (the swappable interface).
 *
 * The app and the edge functions depend on THIS contract, never on a concrete
 * model. To swap the engine later (say a dedicated body/color vision service),
 * write a new class `implements AnalysisProvider` and point the `analyze` edge
 * function at it. Nothing else in the codebase changes.
 *
 * Pure types only. No SDK, no secrets, no runtime deps, so this file is safe in
 * the RN bundle and importable by the Deno edge functions alike.
 */

/** One photo to analyze. Pass base64 data or a (signed) URL. */
export interface PhotoInput {
  base64?: string;
  url?: string;
  /** e.g. 'image/jpeg'. Defaults to image/jpeg when base64 is used. */
  mediaType?: string;
}

export type Gender = 'woman' | 'man' | 'unspecified';

export interface AnalysisContext {
  gender: Gender;
  styleContext?: string;
  archetypes?: string[];
  taste?: string;
}

export interface AnalysisInput {
  photos: PhotoInput[];
  context: AnalysisContext;
}

/** Personal color palette: what flatters, what to avoid. */
export interface ColorPalette {
  flatters: string[];
  avoid: string[];
}

/** A garment detected in a photo, auto-tagged to seed the closet. */
export interface ExtractedItem {
  type: string;
  color?: string;
  pattern?: string;
  attributes?: { fit?: string; silhouette?: string; formality?: string };
}

/**
 * Auto-tags for ONE garment, in the Piece tag shape (single-piece add from the
 * library / camera). All user-facing values are Hebrew, identical in shape to an
 * `ExtractedItem` so a tagged piece is indistinguishable from a photo-extracted one.
 * `type` is always present; the rest are best-effort (a piece still saves without them).
 */
export interface GarmentTag {
  type: string;
  subtype?: string;
  color?: string;
  pattern?: string;
  attributes?: { fit?: string; silhouette?: string; formality?: string };
}

/** One garment photo to tag (a flat-lay or a single worn item), for the add flow. */
export interface GarmentTagInput {
  photo: PhotoInput;
  context?: { gender?: Gender };
}

export interface StyleIdentityRead {
  name: string;
  description: string;
}

export interface LookRead {
  title: string;
  description: string;
}

export interface NextItemRead {
  item: string;
  why: string;
}

/**
 * The structured analysis output. All user-facing text is Hebrew, in the Refined
 * voice. The raw analysis (body/color) maps to profiles.analysis; styleIdentity
 * to profiles.style_identity; extracted_items seed pieces; looks seed outfits;
 * nextItem is the Day-0 shopping seed.
 */
export interface AnalysisResult {
  // the person, analysed first
  body_type: string;
  proportions: string;
  skin_tone: string;
  color_season: string;
  contrast?: string;
  color_palette: ColorPalette;
  // the clothes, second
  extracted_items: ExtractedItem[];
  // the magic-moment contract
  styleIdentity: StyleIdentityRead;
  bodyInsight: string;
  looks: LookRead[]; // exactly 3
  nextItem: NextItemRead;
}

/**
 * The swappable analysis engine. Implementations live server-side (they hold the
 * model key); the app only ever sees `AnalysisResult` through the `analyze` edge
 * function. See `supabase/functions/_shared/analysis-anthropic.ts` for the
 * Anthropic-vision implementation.
 */
export interface AnalysisProvider {
  /** Stable id for logging/telemetry, e.g. 'anthropic-vision'. */
  readonly id: string;
  analyze(input: AnalysisInput): Promise<AnalysisResult>;
  /**
   * Tag a SINGLE garment photo (flat-lay or one worn item) into the Piece tag
   * shape. This is the lightweight counterpart to `analyze` (which expects a
   * full-body PERSON photo); it powers the library / camera "add piece" flow.
   */
  tagGarment(input: GarmentTagInput): Promise<GarmentTag>;
}
