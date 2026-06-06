-- ============================================================
-- Refined — 0006 seed: two more feature flags for scaffolded teasers that did not
-- have a flag yet (barcode add-method, style-evolution recap). Additive, OFF by
-- default like every other 🔒/⚪ flag. Idempotent (on conflict do nothing).
-- ============================================================

insert into public.features (key, enabled, description) values
  ('barcode',         false, 'Barcode scan add-method (scaffolded teaser)'),
  ('style_evolution', false, 'Style evolution recap (scaffolded teaser)')
on conflict (key) do nothing;
