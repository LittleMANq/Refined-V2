-- ============================================================
-- Refined — 0003 storage: private 'photos' bucket, per-user access only.
-- Convention: every object is stored under a folder named after the owner's
-- uid, e.g.  {auth.uid()}/onboarding/front.jpg  or  {auth.uid()}/pieces/{id}.jpg
-- A user can only reach objects under their own uid folder.
-- (storage.objects already has RLS enabled by Supabase; we add the policies.)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists photos_select_own on storage.objects;
create policy photos_select_own on storage.objects
  for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists photos_insert_own on storage.objects;
create policy photos_insert_own on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists photos_update_own on storage.objects;
create policy photos_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists photos_delete_own on storage.objects;
create policy photos_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
