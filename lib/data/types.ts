/**
 * Refined database types — the single source of truth the app imports.
 * Hand-authored to match /supabase/migrations exactly (kept in sync by hand;
 * `supabase gen types` can regenerate the table shapes once the CLI is linked).
 *
 * JSONB columns are typed with concrete shapes for the LIVE objects so the app
 * gets real type-safety; RESERVED (future) JSONB stays loose (`Json`).
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ---------- enums (match the Postgres enum types) ----------
export type Gender = 'woman' | 'man' | 'unspecified';
export type PieceSource = 'photo_analysis' | 'photo_library' | 'gmail' | 'barcode';
export type GeneratedBy = 'ai' | 'user' | 'hybrid';

// ---------- value objects (JSONB shapes) ----------
export type ColorTemperature = 'warm' | 'cool' | 'neutral';
export type SubscriptionTier = 'free' | 'plus';
export type SubscriptionStatus = 'inactive' | 'active' | 'trialing' | 'canceled';

export interface ColorPalette {
  flatters: string[];
  avoid: string[];
}

/** Personal Analysis Engine output (LIVE). */
export interface Analysis {
  body_type?: string;
  proportions?: string;
  skin_tone?: string;
  color_season?: string;
  contrast?: string;
  color_palette?: ColorPalette;
  source_photos?: string[];
}

export interface StyleIdentity {
  name?: string;
  archetypes?: string[];
  confidence_notes?: string; // future
}

export interface Body {
  height?: number;
  weight?: number;
  fit_preferences?: string[];
}

/** Derived from saves/dismissals (LIVE, lightweight). */
export interface PreferenceProfile {
  favored_colors?: string[];
  favored_silhouettes?: string[];
  formality_bias?: number;
}

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  renews_at?: string | null;
}

/** RESERVED (future): social / couple mode. Not implemented. */
export interface Social {
  friends?: string[];
  couple_id?: string | null;
}

export interface PieceAttributes {
  fit?: string;
  silhouette?: string;
  formality?: string;
}

// ---------- Supabase Database type ----------
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          gender: Gender | null;
          style_context: string | null;
          analysis: Analysis | null;
          style_identity: StyleIdentity | null;
          body: Body | null;
          preference_profile: PreferenceProfile | null;
          subscription: Subscription;
          lifestyle: Json | null; // reserved
          shopping_profile: Json | null; // reserved
          social: Social | null; // reserved
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          gender?: Gender | null;
          style_context?: string | null;
          analysis?: Analysis | null;
          style_identity?: StyleIdentity | null;
          body?: Body | null;
          preference_profile?: PreferenceProfile | null;
          subscription?: Subscription;
          lifestyle?: Json | null;
          shopping_profile?: Json | null;
          social?: Social | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          gender?: Gender | null;
          style_context?: string | null;
          analysis?: Analysis | null;
          style_identity?: StyleIdentity | null;
          body?: Body | null;
          preference_profile?: PreferenceProfile | null;
          subscription?: Subscription;
          lifestyle?: Json | null;
          shopping_profile?: Json | null;
          social?: Social | null;
        };
        Relationships: [];
      };
      pieces: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          image_url: string | null;
          type: string | null;
          subtype: string | null;
          color: string | null;
          pattern: string | null;
          brand: string | null;
          price: number | null;
          season: string | null;
          attributes: PieceAttributes | null;
          source: PieceSource;
          extracted_from_photo_id: string | null;
          wear_count: number; // reserved usage
          last_worn: string | null; // reserved
          embedding: Json | null; // reserved
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null;
          type?: string | null;
          subtype?: string | null;
          color?: string | null;
          pattern?: string | null;
          brand?: string | null;
          price?: number | null;
          season?: string | null;
          attributes?: PieceAttributes | null;
          source?: PieceSource;
          extracted_from_photo_id?: string | null;
          wear_count?: number;
          last_worn?: string | null;
          embedding?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          image_url?: string | null;
          type?: string | null;
          subtype?: string | null;
          color?: string | null;
          pattern?: string | null;
          brand?: string | null;
          price?: number | null;
          season?: string | null;
          attributes?: PieceAttributes | null;
          source?: PieceSource;
          extracted_from_photo_id?: string | null;
          wear_count?: number;
          last_worn?: string | null;
          embedding?: Json | null;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          name: string;
          outfit_ids: string[];
          piece_ids: string[];
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          outfit_ids?: string[];
          piece_ids?: string[];
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          outfit_ids?: string[];
          piece_ids?: string[];
        };
        Relationships: [];
      };
      outfits: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          owner_id: string;
          user_ids: string[];
          piece_ids: string[];
          occasion: string | null;
          weather_context: Json | null; // reserved
          reasoning: string;
          generated_by: GeneratedBy;
          saved: boolean;
          dismissed: boolean;
          logged_at: string | null; // reserved
          rating: number | null; // reserved
          tryon_render_url: string | null; // reserved
          collection_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          owner_id: string;
          user_ids: string[];
          piece_ids?: string[];
          occasion?: string | null;
          weather_context?: Json | null;
          reasoning?: string;
          generated_by?: GeneratedBy;
          saved?: boolean;
          dismissed?: boolean;
          logged_at?: string | null;
          rating?: number | null;
          tryon_render_url?: string | null;
          collection_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
          user_ids?: string[];
          piece_ids?: string[];
          occasion?: string | null;
          weather_context?: Json | null;
          reasoning?: string;
          generated_by?: GeneratedBy;
          saved?: boolean;
          dismissed?: boolean;
          logged_at?: string | null;
          rating?: number | null;
          tryon_render_url?: string | null;
          collection_id?: string | null;
        };
        Relationships: [];
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          product: Json | null;
          reason: string | null;
          affiliate_link: string | null;
          sponsored: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          product?: Json | null;
          reason?: string | null;
          affiliate_link?: string | null;
          sponsored?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          product?: Json | null;
          reason?: string | null;
          affiliate_link?: string | null;
          sponsored?: boolean;
        };
        Relationships: [];
      };
      features: {
        Row: {
          key: string;
          enabled: boolean;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          enabled?: boolean;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          enabled?: boolean;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      gender_t: Gender;
      piece_source_t: PieceSource;
      generated_by_t: GeneratedBy;
    };
    CompositeTypes: Record<string, never>;
  };
}

// ---------- convenience aliases ----------
type Tables = Database['public']['Tables'];

export type Profile = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type Piece = Tables['pieces']['Row'];
export type PieceInsert = Tables['pieces']['Insert'];
export type PieceUpdate = Tables['pieces']['Update'];

export type Collection = Tables['collections']['Row'];
export type CollectionInsert = Tables['collections']['Insert'];
export type CollectionUpdate = Tables['collections']['Update'];

export type Outfit = Tables['outfits']['Row'];
export type OutfitInsert = Tables['outfits']['Insert'];
export type OutfitUpdate = Tables['outfits']['Update'];

export type Recommendation = Tables['recommendations']['Row'];
export type RecommendationInsert = Tables['recommendations']['Insert'];
export type RecommendationUpdate = Tables['recommendations']['Update'];

export type FeatureFlag = Tables['features']['Row'];
