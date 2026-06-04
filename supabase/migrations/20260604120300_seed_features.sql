-- ============================================================
-- Refined — 0004 seed: feature flags. Every 🔒 SCAFFOLDED / ⚪ FUTURE feature
-- starts OFF. LIVE features are always on and need no flag. Flip a row to reveal.
-- ============================================================

insert into public.features (key, enabled, description) values
  ('gmail_import',             false, 'Gmail receipt import (scaffolded)'),
  ('collections',              false, 'Outfit / piece collections (scaffolded)'),
  ('weather_styling',          false, 'Weather-aware styling (scaffolded)'),
  ('event_styling',            false, 'Event-based styling (scaffolded)'),
  ('virtual_tryon',            false, 'Virtual try-on / digital twin (scaffolded)'),
  ('shopping_recommendations', false, 'Native shopping recommendations (scaffolded)'),
  ('wishlist',                 false, 'Wishlist (scaffolded)'),
  ('friends',                  false, 'Private friends (scaffolded)'),
  ('couple_mode',              false, 'Couple mode cross-wardrobe looks (future)'),
  ('daily_loop',               false, 'Daily look notification engine (scaffolded)'),
  ('weekly_progress',          false, 'Weekly progress recap (future)'),
  ('location_permission',      false, 'Location capture for weather (scaffolded)')
on conflict (key) do nothing;
