# Refined — Claude Code Build Pack

Ready-to-paste prompts, in order. Each builds on the last. This pack gets Claude Code from an empty folder to the finished onboarding flow (the only Phase-1 surface that must be perfect).

---

## How to use this pack
1. Put `CLAUDE.md` at the repo root and the three specs in `/docs` (`Refined_MVP_Structure.md`, `Refined_Features.md`, `Refined_Retention_Growth.md`).
2. Keep the approved design gallery (`Refined_Gallery__standalone_.html`) in the repo (e.g. `/docs/design/`) and **attach it to the Claude Code session for Prompts 2 and 5** so Code builds from the real visuals, not just hex codes.
3. Run the prompts **in order**, one Claude Code session each.
4. **Commit after each** once its Acceptance Criteria pass. Do not start the next prompt on a red build.
5. If a prompt feels too big for one session, tell Claude Code to do it in stages and check in.

## Before you start (you provide these)
- Node LTS + a free **Expo / EAS** account.
- A **Supabase** project: URL, anon key, service-role key (service-role is server-side only).
- An **Anthropic API** key (used only inside Supabase Edge Functions, never in the app).
- Defer until their feature prompts: **RevenueCat** (paywall), **PostHog** (analytics).
- Decision already made: **photo analysis uses Anthropic vision at MVP, behind a swappable interface.**

---

## Prompt 1 — Scaffold

```
## Task
Initialize the Refined project: an Expo / React Native (TypeScript) app with the full folder structure, Supabase client, i18n + RTL, and tooling. No features yet.

## Context
Greenfield. Read CLAUDE.md fully first; follow the stack in §6 and the layout in §7. Hebrew-first, RTL.

## Requirements
1. Init an Expo app (TypeScript) with Expo Router for navigation. Add Reanimated and Skia.
2. Create the exact folder structure from CLAUDE.md §7.
3. RTL on by default (I18nManager allow + force for `he`). Set up i18n with `he` and `en` dictionaries, `he` default. Every UI string comes from i18n; none hardcoded.
4. Install and initialize the Supabase JS client in /lib/data using EXPO_PUBLIC_SUPABASE_URL + anon key from env. The service-role key is never imported in the app.
5. Add a TanStack Query provider at the app root.
6. Env handling: .env (gitignored) + .env.example. No secrets committed.
7. Add a minimal placeholder Today screen so the app boots.
8. Configure TypeScript strict, ESLint, Prettier. Add scripts: dev, typecheck, lint, test.

## Constraints
Do not build any product screens beyond the placeholder. Do not put the service-role key or any secret in the client. Do not hardcode user-facing strings.

## Acceptance Criteria
- `npx expo start` boots to the placeholder, rendered RTL.
- `npm run typecheck` and `npm run lint` pass clean.
- Folder structure matches CLAUDE.md §7.
- Switching the i18n locale swaps all visible text.

## Notes
This is foundation only. Commit when green.
```

---

## Prompt 2 — Design system in code

```
## Task
Implement the Refined design system as a single-source theme plus reusable RTL-aware components.

## Context
Tokens are in CLAUDE.md §4. Premium and calm. Hebrew-first, RTL. Fonts: Heebo (sans) + Frank Ruhl Libre (serif, hero only). **Match the approved design gallery as the visual source of truth — attach `Refined_Gallery__standalone_.html` (or screenshots of it) to this Claude Code session and replicate its components, spacing, and proportions.** The gallery is the target; the tokens below are the underlying system.

## Requirements
1. A theme module (single source of truth): the exact color hex set, a spacing scale, radii, and a type scale built on weight contrast.
2. Load Heebo (multiple weights) and Frank Ruhl Libre. A helper for serif hero text.
3. Core components in /components, all RTL-aware: PillButton (primary/secondary), Card (soft), GarmentSlot (3:4 portrait), Hairline divider, ScreenHeader, Label/Text.
4. A reusable reveal-motion helper (Reanimated): staged fade + scale for hero moments.
5. A dev-only gallery screen rendering every component, the palette, and the type scale.

## Constraints
One accent only (#B08953). No other colors, no purple, no decorative gradients. No square garment images. No serif for body text. No scattered micro-animations.

## Acceptance Criteria
- The gallery screen renders every component, the palette, and the type scale.
- Both fonts load and Hebrew renders correctly in each.
- Components mirror correctly in RTL.
- typecheck + lint pass.

## Notes
This is the visual DNA. Every later screen imports from here, never re-defines tokens.
```

---

## Prompt 3 — Data schema + types

```
## Task
Implement the Supabase schema, RLS policies, storage, and shared TypeScript types from the data model.

## Context
Follow the data model in /docs/Refined_MVP_Structure.md §7 exactly. Postgres. Build LIVE fields now; reserve future fields as nullable columns or JSONB.

## Requirements
1. Migrations for: profiles (user), pieces, outfits, collections. Reserve: `analysis` JSONB (body_type, proportions, skin_tone, color_season, color_palette{flatters,avoid}, source_photos), `preference_profile` JSONB, subscription, `social` JSONB (friends, couple_id).
2. Outfits must support being shared by MORE THAN ONE user (couple mode is FUTURE but the schema must allow a look to span two wardrobes now): use a user_ids array or a join table, and allow piece_ids from two owners.
3. RLS: a user reads/writes only their own rows; an outfit is readable by every user listed on it (couple-ready).
4. A photos storage bucket with per-user access.
5. Generate TypeScript types from the schema, exported from /lib/data as the single source of truth. The app imports these.
6. A `features` flags mechanism (table or remote config) plus a helper to read a flag with a default.

## Constraints
Do not invent fields beyond the doc. Do not build feature logic. Future fields stay nullable and unused. Never expose the service-role key client-side.

## Acceptance Criteria
- Migrations apply cleanly on a fresh Supabase project.
- A test shows RLS blocks cross-user reads.
- An outfit can reference two user_ids and pieces from both (schema-level).
- Generated types compile; the flags helper returns defaults.

## Notes
Object shapes must match /docs exactly. Couple cross-wardrobe support exists now even though the feature is FUTURE.
```

---

## Prompt 4 — AI services (the soul of the product)

```
## Task
Build the server-side AI layer as Supabase Edge Functions: personal analysis, outfit generation with reasoning, and stylist chat.

## Context
Tone and voice: CLAUDE.md §2/§3 (Hebrew, simple, warm, always explain the why, no em dash). Pipeline: /docs/Refined_MVP_Structure.md §6 + §8. Output contract: /docs/Refined_Features.md Module 1. Analysis uses Anthropic vision at MVP, behind a swappable interface.

## Requirements
1. Edge function `analyze`: input photo(s) -> Anthropic vision -> structured JSON: body_type, proportions, skin_tone, color_season, color_palette{flatters,avoid}, extracted_items[]{type,color,pattern,attributes}, styleIdentity{name,description}, bodyInsight (one sharp line, not a list), looks[3]{title,description}, nextItem{item,why}. All user-facing text in Hebrew, tone rules embedded in the system prompt, no em dash.
2. Wrap the vision call behind an AnalysisProvider interface in /lib/analysis so the model can be swapped without changing callers.
3. Edge function `generate-outfit`: input analysis + closet + context -> pipeline (candidate -> score on color-palette fit, proportion, silhouette, formality, aesthetic consistency -> select -> reason). Output an Outfit with a non-empty `reasoning` in Hebrew that explains why.
4. Edge function `stylist-chat`: answers reference the user's analysis and actual closet pieces; same tone rules.
5. All Anthropic calls are server-side only; the key is read from edge env; it never appears in the app. The app calls these via supabase.functions.invoke.
6. Embed the output schema + tone rules in each system prompt. Parse and validate JSON. On bad input, return a structured error, never crash.

## Constraints
No API key in the client. No em dash in any user-facing string. The `reasoning` field is never empty or skipped. Keep the analysis provider swappable. Build no UI here.

## Acceptance Criteria
- `analyze` on a sample photo returns schema-conformant JSON, Hebrew text, zero em dashes.
- `generate-outfit` returns an outfit with a real reasoning string.
- Malformed input returns a structured error, not a crash.
- No key is present in the client bundle.

## Notes
Production prompts live in /lib/ai/prompts and are versioned. The "does this feel right?" confirm step is wired in onboarding (Prompt 5) and may adjust the analysis.
```

---

## Prompt 5 — Onboarding + analysis flow (the make-or-break feature)

```
## Task
Build the complete LIVE onboarding and analysis flow, end to end, landing the user in the app.

## Context
Flow: /docs/Refined_Features.md Module 1 and /docs/Refined_MVP_Structure.md §5 (onboarding). Use the design system (Prompt 2), AI functions (Prompt 4), schema/types (Prompt 3). Hebrew, RTL. **Match the approved design gallery (`Refined_Gallery__standalone_.html`) screen-for-screen — attach it to this session. Replace any placeholder copy in the gallery with proper authored Hebrew strings in the i18n dictionary; do not ship the gallery's placeholder text.**

## Requirements (screens, in order)
1. Welcome / value proposition.
2. Gender + style context.
3. Style archetype picker: 2-column editorial-image grid, RTL, multi-select.
4. Photo capture: guided full-body capture (lighting/framing tips), library allowed, basic quality check.
5. Analysis loading: cinematic, staged; calls `analyze`.
6. One or two taste questions.
7. Style Identity + Color Palette reveal: the hero. Frank Ruhl Libre for the identity name, reveal motion, shows the first looks, and a "does this feel right?" confirm that can adjust the analysis.
8. Soft/late sign-up: Apple + Google + email, framed as saving the result (after the reveal, never before).
9. Permissions: notifications (live) and location (shown but scaffolded).
Persist the analysis and extracted pieces (swipe keep/remove) to Supabase. Land the user on the placeholder Today screen.

## Constraints
Do not gate the wow behind sign-up. No em dash. All strings via i18n. Build only onboarding. Scaffold, do not activate, anything FUTURE. Affirming framing only, never deficit framing.

## Acceptance Criteria (tie to Phase-1 Definition of Done)
- A full run on a device leaves the user with: (a) a believable Style Identity, (b) ~8–10 pieces saved to the closet, (c) at least one saved look.
- Flow is fully RTL and Hebrew; the reveal uses the serif face + reveal motion.
- Analysis errors fall back gracefully without dead-ending the user.
- typecheck + lint pass.

## Notes
This is the emotional peak of the product. Match the design system exactly and give the reveal the most polish of any screen.
```

---

## Remaining Phase-1 prompts (queue — generate when we reach them)
These come *after* the foundation exists, so they can be specced precisely against real code:
6. **Closet UI** (grid, filters, piece detail, add-piece sheet) — built on Prompt 3 schema + Prompt 2 components.
7. **Today screen** (daily look + reasoning, regenerate/save/"why this?") — built on Prompt 4 `generate-outfit`.
8. **Create** (manual build + smart generator) — built on Prompt 4.
9. **Stylist chat UI** — built on Prompt 4 `stylist-chat`.
10. **Paywall** (RevenueCat) + **analytics** (PostHog, first-session-success metric).

Each will follow the same Task / Context / Requirements / Constraints / Acceptance Criteria / Notes structure.
