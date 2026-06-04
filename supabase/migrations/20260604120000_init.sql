-- ============================================================
-- Refined — 0001 init: extensions, enums, tables, triggers, indexes
-- Data model: /docs/Refined_MVP_Structure.md §7.
-- LIVE fields are built now; future fields are RESERVED (nullable, unused).
-- ============================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------- enums (constrained sets) ----------
do $$ begin
  create type public.gender_t as enum ('woman', 'man', 'unspecified');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.piece_source_t as enum ('photo_analysis', 'photo_library', 'gmail', 'barcode');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.generated_by_t as enum ('ai', 'user', 'hybrid');
exception when duplicate_object then null; end $$;

-- ---------- updated_at helper ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ============================================================
-- profiles (the User: profile + analysis + preference_profile + reserved)
-- Keyed 1:1 to auth.users.
-- ============================================================
create table if not exists public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  gender             public.gender_t,
  style_context      text,
  analysis           jsonb,        -- LIVE: { body_type, proportions, skin_tone, color_season, color_palette{flatters,avoid}, source_photos[] }
  style_identity     jsonb,        -- LIVE: { name, archetypes[], confidence_notes(future) }
  body               jsonb,        -- LIVE: { height, weight, fit_preferences }
  preference_profile jsonb,        -- LIVE (lightweight): { favored_colors[], favored_silhouettes[], formality_bias }
  subscription       jsonb not null default jsonb_build_object('tier', 'free', 'status', 'inactive'),
  lifestyle          jsonb,        -- RESERVED (future)
  shopping_profile   jsonb,        -- RESERVED (future)
  social             jsonb         -- RESERVED (future): { friends[], couple_id }
);
comment on column public.profiles.social is 'RESERVED for future social / couple mode: { friends: [], couple_id }. Not implemented.';
comment on column public.profiles.lifestyle is 'RESERVED (future).';
comment on column public.profiles.shopping_profile is 'RESERVED (future).';

-- ============================================================
-- pieces (wardrobe items)
-- ============================================================
create table if not exists public.pieces (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  image_url              text,                       -- storage path in the private 'photos' bucket
  type                   text,
  subtype                text,
  color                  text,
  pattern                text,
  brand                  text,
  price                  numeric(10, 2),
  season                 text,
  attributes             jsonb,                      -- { fit, silhouette, formality }
  source                 public.piece_source_t not null default 'photo_library',
  extracted_from_photo_id text,                      -- links the item back to a source photo
  wear_count             integer not null default 0, -- RESERVED (future) usage tracking
  last_worn              timestamptz,                -- RESERVED (future)
  embedding              jsonb                       -- RESERVED (future): migrate to pgvector when search ships
);

-- ============================================================
-- collections (scaffolded grouping of outfits/pieces)
-- ============================================================
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null,
  outfit_ids  uuid[] not null default '{}',
  piece_ids   uuid[] not null default '{}'
);

-- ============================================================
-- outfits (the look + reasoning). Couple-ready: user_ids is an array so a single
-- outfit can belong to two users (cross-wardrobe). RESERVED — not implemented.
-- ============================================================
create table if not exists public.outfits (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  owner_id         uuid not null references auth.users (id) on delete cascade,
  user_ids         uuid[] not null default '{}',  -- members; one today, TWO for couple mode (reserved)
  piece_ids        uuid[] not null default '{}',  -- may span two wardrobes in couple mode (reserved)
  occasion         text,
  weather_context  jsonb,                          -- RESERVED (future)
  reasoning        text not null default '',       -- always present (core thesis)
  generated_by     public.generated_by_t not null default 'ai',
  saved            boolean not null default false, -- preference signal
  dismissed        boolean not null default false, -- preference signal
  logged_at        timestamptz,                    -- RESERVED (future)
  rating           smallint,                       -- RESERVED (future)
  tryon_render_url text,                           -- RESERVED (future)
  collection_id    uuid references public.collections (id) on delete set null
);
comment on column public.outfits.user_ids is 'Members of the outfit. One today; reserved to hold two for couple mode (cross-wardrobe). Not implemented.';

-- ============================================================
-- recommendations (RESERVED — shopping/affiliate, off at launch)
-- ============================================================
create table if not exists public.recommendations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  created_at     timestamptz not null default now(),
  product        jsonb,
  reason         text,
  affiliate_link text,
  sponsored      boolean not null default false
);

-- ============================================================
-- features (remote flag config: flip a row to reveal a scaffolded/future feature)
-- ============================================================
create table if not exists public.features (
  key         text primary key,
  enabled     boolean not null default false,
  description text,
  updated_at  timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
create or replace trigger trg_profiles_updated
  before update on public.profiles for each row execute function public.set_updated_at();
create or replace trigger trg_pieces_updated
  before update on public.pieces for each row execute function public.set_updated_at();
create or replace trigger trg_collections_updated
  before update on public.collections for each row execute function public.set_updated_at();
create or replace trigger trg_outfits_updated
  before update on public.outfits for each row execute function public.set_updated_at();
create or replace trigger trg_features_updated
  before update on public.features for each row execute function public.set_updated_at();

-- ---------- auto-create a profile row when an auth user is created ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end; $$;

create or replace trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ---------- indexes ----------
create index if not exists idx_pieces_user_id on public.pieces (user_id);
create index if not exists idx_collections_user_id on public.collections (user_id);
create index if not exists idx_outfits_owner_id on public.outfits (owner_id);
create index if not exists idx_outfits_user_ids on public.outfits using gin (user_ids);
create index if not exists idx_outfits_collection_id on public.outfits (collection_id);
create index if not exists idx_recommendations_user_id on public.recommendations (user_id);
