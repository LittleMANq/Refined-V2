# /supabase

Supabase project assets for Refined: schema migrations, RLS policies, and storage
config. Edge Functions (analyze, generate-outfit, stylist-chat) arrive in Prompt 4.

Data model: `/docs/Refined_MVP_Structure.md` §7.

## Project

- Name: **Refined** · ref `pvltelvkoatviseadghr` (region ap-northeast-2, Postgres 17).
- This ref matches `EXPO_PUBLIC_SUPABASE_URL` in `.env`.
- ⚠️ The `service role key` in `keys.txt` is **stale** — its JWT decodes to a
  different project ref (`nqopsjyyzsicjegrdcpk`) that does not exist in this
  account. It is never used by the app. Before Prompt 4 (Edge Functions), pull the
  **correct** service-role key for `pvltelvkoatviseadghr` from the dashboard
  (Settings → API) and store it as an Edge Function secret, never in the client.

## Migrations (`/supabase/migrations`, applied in filename order)

1. `…_init.sql` — extensions, enums (`gender_t`, `piece_source_t`, `generated_by_t`),
   tables (`profiles`, `pieces`, `collections`, `outfits`, `recommendations`,
   `features`), `updated_at` triggers, a `handle_new_user` trigger that creates a
   profile row on signup, and indexes.
2. `…_rls.sql` — `enable row level security` + explicit per-command policies + grants.
3. `…_storage.sql` — private `photos` bucket + per-user object policies.
4. `…_seed_features.sql` — seeds the 🔒/⚪ feature flags (all OFF).
5. `…_piece_wears.sql` — append-only `piece_wears` wear log (own-row RLS, piece-
   ownership-checked insert) + a trigger that rolls each row up into
   `pieces.wear_count` / `last_worn`. Recording only; no insight logic.

### Reserved (future) fields — declared, not implemented

`profiles.social` (`{ friends, couple_id }`), `lifestyle`, `shopping_profile`;
`outfits.user_ids` (couple-mode cross-wardrobe membership), `weather_context`,
`rating`, `tryon_render_url`; `pieces.embedding`. (`outfits.logged_at` and
`pieces.wear_count` / `last_worn` are now WRITTEN: see migration 5, wear recording.)

## RLS — the privacy guarantee

Every table has RLS ON. A user can read/write only their **own** rows; cross-user
reads are blocked by default.

- `profiles` keyed by `id = auth.uid()`; `pieces`/`collections`/`recommendations`
  by `user_id = auth.uid()`.
- `outfits` use membership (`auth.uid() = any(user_ids)`) so the schema is
  couple-ready, but today `user_ids` holds only the owner, so it behaves as
  own-rows-only. Writes are owner-gated.
- `features` is global read-only config (any signed-in user may read; no write
  policy, so only the service role can change flags).
- Storage: objects must live under a folder named after the owner's uid
  (`{auth.uid()}/…`); a user can only reach their own folder.

## Storage path convention

`photos/{auth.uid()}/onboarding/front.jpg`, `photos/{auth.uid()}/pieces/{id}.jpg`, …
The bucket is private; the app reads via short-lived signed URLs.

## Applying / re-applying

Migrations were applied to the live project and verified (RLS on for all tables;
a two-user isolation test confirmed user B reads 0 of user A's rows; bucket
private; 12 flags seeded). To re-apply elsewhere or after edits, use the Supabase
CLI:

```bash
supabase link --project-ref pvltelvkoatviseadghr
supabase db push
```

Or paste each migration into the dashboard SQL editor in filename order. After a
schema change, regenerate types to keep `/lib/data/types.ts` honest:

```bash
supabase gen types typescript --project-id pvltelvkoatviseadghr > lib/data/types.generated.ts
```

(We currently hand-maintain `/lib/data/types.ts` so the LIVE JSONB columns get
concrete shapes; reconcile by hand against the generated output.)
