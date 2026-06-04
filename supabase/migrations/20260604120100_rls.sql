-- ============================================================
-- Refined — 0002 RLS: own-row access only. This is the privacy guarantee.
-- Every table has RLS ON. Cross-user reads are blocked by default (no policy
-- grants access to another user's rows). Policies are written explicitly per
-- command. auth.uid() is wrapped in a subselect (Supabase perf guidance).
-- ============================================================

-- Table-level grants (RLS still governs which ROWS are visible).
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles       to authenticated;
grant select, insert, update, delete on public.pieces         to authenticated;
grant select, insert, update, delete on public.collections    to authenticated;
grant select, insert, update, delete on public.outfits        to authenticated;
grant select, insert, update, delete on public.recommendations to authenticated;
grant select on public.features to anon, authenticated;

-- ---------- profiles: own row only (id = uid) ----------
alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own on public.profiles
  for delete to authenticated using (id = (select auth.uid()));

-- ---------- pieces: own rows only (user_id = uid) ----------
alter table public.pieces enable row level security;

drop policy if exists pieces_select_own on public.pieces;
create policy pieces_select_own on public.pieces
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists pieces_insert_own on public.pieces;
create policy pieces_insert_own on public.pieces
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists pieces_update_own on public.pieces;
create policy pieces_update_own on public.pieces
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists pieces_delete_own on public.pieces;
create policy pieces_delete_own on public.pieces
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------- collections: own rows only (user_id = uid) ----------
alter table public.collections enable row level security;

drop policy if exists collections_select_own on public.collections;
create policy collections_select_own on public.collections
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists collections_insert_own on public.collections;
create policy collections_insert_own on public.collections
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists collections_update_own on public.collections;
create policy collections_update_own on public.collections
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists collections_delete_own on public.collections;
create policy collections_delete_own on public.collections
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------- outfits: membership-based (couple-ready) ----------
-- Readable by every user listed in user_ids. Today that array holds only the
-- owner, so this is own-rows-only and cross-user reads are blocked. When couple
-- mode ships later, a second uid in user_ids lets the partner read. Writes are
-- owner-gated.
alter table public.outfits enable row level security;

drop policy if exists outfits_select_member on public.outfits;
create policy outfits_select_member on public.outfits
  for select to authenticated using ((select auth.uid()) = any (user_ids));

drop policy if exists outfits_insert_owner on public.outfits;
create policy outfits_insert_owner on public.outfits
  for insert to authenticated
  with check (owner_id = (select auth.uid()) and (select auth.uid()) = any (user_ids));

drop policy if exists outfits_update_member on public.outfits;
create policy outfits_update_member on public.outfits
  for update to authenticated
  using ((select auth.uid()) = any (user_ids))
  with check ((select auth.uid()) = any (user_ids));

drop policy if exists outfits_delete_owner on public.outfits;
create policy outfits_delete_owner on public.outfits
  for delete to authenticated using (owner_id = (select auth.uid()));

-- ---------- recommendations: own rows only (user_id = uid) ----------
alter table public.recommendations enable row level security;

drop policy if exists recommendations_select_own on public.recommendations;
create policy recommendations_select_own on public.recommendations
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists recommendations_insert_own on public.recommendations;
create policy recommendations_insert_own on public.recommendations
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists recommendations_update_own on public.recommendations;
create policy recommendations_update_own on public.recommendations
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists recommendations_delete_own on public.recommendations;
create policy recommendations_delete_own on public.recommendations
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------- features: global read-only config ----------
-- Intentional exception to own-row access: feature flags are non-sensitive
-- global config, readable by everyone (incl. pre-account/onboarding). There is
-- NO write policy, so clients cannot modify flags; only the service role
-- (dashboard / edge functions) can, by bypassing RLS.
alter table public.features enable row level security;

drop policy if exists features_select_all on public.features;
create policy features_select_all on public.features
  for select to anon, authenticated using (true);
