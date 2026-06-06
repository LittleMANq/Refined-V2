-- ============================================================
-- Refined — 0005 piece wears: record per-piece wear history from today.
-- Additive only (new table + trigger + policies); no breaking changes.
--
-- WHY: pieces.wear_count / last_worn were reserved (§7) but never written, and
-- per-piece wear history cannot be backfilled. This starts RECORDING it now so
-- future closet-insights / weekly-progress / Style Wrapped / daily-loop "unworn
-- this week" have real, dated usage to read. Data model: §7 + retention §8b.
--
-- SHAPE: piece_wears is the append-only, DATED source of truth (one row per piece
-- worn in a look) that cannot be reconstructed later. pieces.wear_count /
-- last_worn are a cheap denormalized rollup kept in sync by a trigger, for fast
-- "most worn" / "cost per wear" / "unworn since" reads. RECORDING ONLY — no
-- insight / progress / loop logic is built here.
-- ============================================================

-- ---------- wear log: one row per (piece worn in an outfit) event ----------
create table if not exists public.piece_wears (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  piece_id   uuid not null references public.pieces (id) on delete cascade,
  outfit_id  uuid references public.outfits (id) on delete set null, -- the look it was worn in (nullable)
  worn_at    timestamptz not null default now(),
  created_at timestamptz not null default now()
);
comment on table public.piece_wears is
  'Append-only wear log: one row per piece worn in an outfit. The dated source of truth for future closet-insights / weekly-progress / Wrapped; not backfillable, so recorded from launch. pieces.wear_count/last_worn are a trigger-maintained rollup of this.';

create index if not exists idx_piece_wears_user_id on public.piece_wears (user_id);
create index if not exists idx_piece_wears_piece_id on public.piece_wears (piece_id);
-- windowed history reads later (this week / this month / Wrapped):
create index if not exists idx_piece_wears_user_worn_at on public.piece_wears (user_id, worn_at desc);

-- ---------- denormalized rollup: keep pieces.wear_count / last_worn in sync ----------
-- SECURITY DEFINER so the rollup runs regardless of RLS context; scoped to the
-- owner (id + user_id) so it can only ever touch the wearer's own piece. The
-- insert policy below additionally proves the caller owns the piece, so the
-- counter can never be inflated for another user.
create or replace function public.apply_piece_wear()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.pieces
     set wear_count = wear_count + 1,
         last_worn  = greatest(coalesce(last_worn, 'epoch'::timestamptz), new.worn_at)
   where id = new.piece_id
     and user_id = new.user_id;
  return new;
end; $$;

create or replace trigger trg_piece_wears_apply
  after insert on public.piece_wears for each row execute function public.apply_piece_wear();

-- ---------- RLS: own rows only (append + read + undo) ----------
grant select, insert, delete on public.piece_wears to authenticated;

alter table public.piece_wears enable row level security;

drop policy if exists piece_wears_select_own on public.piece_wears;
create policy piece_wears_select_own on public.piece_wears
  for select to authenticated using (user_id = (select auth.uid()));

-- Insert only own rows, and only for a piece the caller actually owns, so the
-- rollup trigger can never increment another user's wear_count.
drop policy if exists piece_wears_insert_own on public.piece_wears;
create policy piece_wears_insert_own on public.piece_wears
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.pieces p
      where p.id = piece_id and p.user_id = (select auth.uid())
    )
  );

drop policy if exists piece_wears_delete_own on public.piece_wears;
create policy piece_wears_delete_own on public.piece_wears
  for delete to authenticated using (user_id = (select auth.uid()));
