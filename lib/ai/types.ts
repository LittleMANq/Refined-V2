import type { ColorPalette, Gender } from '../analysis/types.ts';

/**
 * Types for the stylist reasoning engine. Pure types, shared by the app
 * (type-only) and the Deno edge functions. Imports use explicit `.ts` so Deno
 * can resolve them; for the app these are type-only and erased at build time.
 */

/** The slice of the personal analysis the reasoning + chat engines actually read. */
export interface AnalysisCore {
  body_type?: string;
  proportions?: string;
  skin_tone?: string;
  color_season?: string;
  color_palette?: ColorPalette;
}

/** A lightweight closet item for the engine (a subset of the DB Piece row). */
export interface ClosetPiece {
  id: string;
  type: string | null;
  subtype?: string | null;
  color?: string | null;
  pattern?: string | null;
  season?: string | null;
  attributes?: { fit?: string; silhouette?: string; formality?: string } | null;
}

export interface OutfitContext {
  gender: Gender;
  occasion?: string;
}

export interface GenerateOutfitInput {
  analysis: AnalysisCore;
  styleIdentity: { name: string; description?: string };
  closet: ClosetPiece[];
  context: OutfitContext;
}

/** Transparent per-dimension scores (0..1) for the chosen look. */
export interface OutfitScore {
  total: number;
  colorPalette: number;
  proportion: number;
  silhouette: number;
  formality: number;
  consistency: number;
}

/** Deterministic pipeline output (pre-reasoning). */
export interface OutfitSelection {
  piece_ids: string[];
  score: OutfitScore;
}

/** Full reasoning-engine output. `reasoning` is Hebrew and never empty. */
export interface GeneratedOutfit {
  piece_ids: string[];
  occasion: string | null;
  reasoning: string;
  generated_by: 'ai';
  score: OutfitScore;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StylistChatInput {
  messages: ChatMessage[];
  analysis?: AnalysisCore;
  styleIdentity?: { name: string; description?: string };
  closet?: ClosetPiece[];
  context?: { gender: Gender };
}

export interface StylistChatResult {
  reply: string;
}
