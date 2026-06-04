# Refined — Feature Specification (features.md)

*Companion to `Refined_MVP_Structure.md`. The structure doc is the architecture; this is the per-feature detail. Every feature below is specified so it can be built and verified, and so future features slot into the same shape.*

---

## How to read this

Each feature uses the same block so nothing is missed:

- **State** — 🟢 LIVE · 🔒 SCAFFOLDED · ⚪ FUTURE
- **Purpose** — product + emotional reason it exists
- **How it works** — mechanics / flow
- **Data** — objects/fields it reads (R) and writes (W); see structure doc §7
- **AI logic** — if any
- **UX (Hebrew/RTL)** — key interactions + premium + RTL notes
- **Depends on** — prerequisites
- **Role** — retention / monetization / activation
- **Structure note** — how it is future-proofed

### Foundations (apply to every feature)
- **Language:** Hebrew-first, **RTL** everywhere. Architected **bilingual**: all strings via an i18n dictionary (`he`/`en`), never hardcoded, so English (or more) flips on later with zero rework. Tone: simple, warm, explains the *why*, gender-adaptive, no em dash.
- **Type:** Heebo (sans, weight contrast) + Frank Ruhl Libre (serif, hero moments only).
- **Palette:** ink `#1B1714` · paper `#FAF7F2` · surface `#F1ECE4` · hairline `#E2DBD0` · secondary text `#8A8178` · **accent (antique gold) `#B08953`**. One accent only.
- **Components:** full-width pill CTAs · soft cards · 3:4 portrait garment slots · hairline dividers · generous whitespace.
- **Feature flags:** every 🔒/⚪ feature is gated by a remote `features` config; flip to activate, no redeploy.

---

# MODULE 1 — Onboarding & Personal Analysis

The make-or-break flow. Goal: a few good photos in, a personal analysis + Style Identity out, *before* any manual wardrobe work.

### 🟢 Style archetype picker
- **Purpose:** sets emotional tone and a first identity signal; makes onboarding feel aspirational, not like a form.
- **How it works:** 2-column grid of editorial archetype tiles (e.g. מינimal / סטריט / קלאסי / ספורט-שיק); single or multi-select.
- **Data:** W `User.style_identity.archetypes`, contributes to `style_context`.
- **AI logic:** none (input only).
- **UX (Hebrew/RTL):** real styled photography, RTL grid, Hebrew labels, accent ring on selection.
- **Depends on:** gender + style_context chosen on prior screen.
- **Role:** activation (emotional buy-in).
- **Structure note:** archetype list is config-driven per gender segment, so adding the second segment is data, not code.

### 🟢 Photo capture
- **Purpose:** the single input that powers the whole analysis; replaces selfie with richer full-body shots.
- **How it works:** guided capture (lighting/framing tips), 1–3 full-body photos; accepts library uploads.
- **Data:** W `User.analysis.source_photos[]` (storage refs only).
- **AI logic:** quality check (is the photo usable: full body, lighting, single person).
- **UX (Hebrew/RTL):** calm guided overlay, Hebrew microcopy, retake affordance; privacy reassurance line.
- **Depends on:** camera/library permission.
- **Role:** activation (effort step, kept minimal and premium).
- **Structure note:** photos are stored with IDs so extracted items link back (`Piece.extracted_from_photo_id`).

### 🟢 Personal Analysis Engine (the differentiator)
- **Purpose:** the wedge Fitted lacks — analyse the *person*, not just clothes.
- **How it works:** from the photos derive (a) body type & proportions, (b) skin tone / color season + contrast, (c) extracted worn items. Shown via a premium loading moment.
- **Data:** W `User.analysis.{body_type, proportions, skin_tone, color_season, color_palette}`; W `Piece[]` (extracted items) with `source = photo_analysis`.
- **AI logic:** vision model(s) for body/proportion estimate, skin-tone/season classification, garment detection + auto-tagging (type, color, pattern).
- **UX (Hebrew/RTL):** cinematic loading with progress phrasing ("מנתחים את הפרופורציות שלך…"); never feels like a spinner.
- **Depends on:** photo capture.
- **Role:** activation + word-of-mouth (the "this gets me" engine).
- **Structure note:** each analysis sub-task is a separate module behind one orchestrator, so any one can be upgraded independently.

### 🟢 Taste questions (1–2)
- **Purpose:** disambiguate identity where photos are not enough (e.g. comfort vs. statement).
- **How it works:** 1–2 quick choice cards.
- **Data:** W `User.style_identity`, `lifestyle` (partial).
- **AI logic:** feeds Style Identity synthesis.
- **UX:** minimal, 2–3 options, RTL pill choices.
- **Role:** personalization depth.
- **Structure note:** question set is config-driven; expandable without code.

### 🟢 Style Identity + Color Palette reveal
- **Purpose:** the emotional payoff; the moment the user feels understood.
- **How it works:** named identity (e.g. "מינימל יוקרתי"), a short human explanation, the personal color palette (flatters / avoid), and the first looks.
- **Data:** R `User.analysis`, `style_identity`; generates first `Outfit[]`.
- **AI logic:** synthesis + reasoning generation (always explained). **Structured output contract:** `styleIdentity {name, description}` · `bodyInsight` (one sharp practical insight, not a list) · `looks[3]` (each `{title, description}`) · `nextItem {item, why}` (one item worth buying, explained — the native shopping seed from Day 0). All text follows the tone rules; tone rules are included in the model prompt.
- **UX (Hebrew/RTL):** **hero moment** — Frank Ruhl Libre serif for the identity name, gold accent, generous space; the one screen that must feel luxurious.
- **Depends on:** analysis + taste questions.
- **Role:** activation (the wow), shareability.
- **Structure note:** reveal pulls from the same `Outfit` + reasoning pipeline used everywhere, so it is never a one-off.

### 🟢 Soft / late sign-up
- **Purpose:** capture the account *after* the value, framed as saving the result, not a gate.
- **How it works:** "שמור את זהות הסטייל שלך"; email + Apple + Google.
- **Data:** W account; links anonymous session to user.
- **UX:** framed as saving, not a barrier; appears after the reveal only.
- **Role:** activation → retention bridge.
- **Structure note:** anonymous-first session so analysis can run pre-account, then merge on sign-up.

### 🟢 Notifications permission · 🔒 Location permission
- **Purpose:** daily outfit nudge (notifications, LIVE) and weather styling (location, scaffolded).
- **UX:** value-led copy; never spammy; location is shown but inactive at launch.
- **Role:** retention (notifications), future relevance (location).
- **Structure note:** location captured into context object that the AI pipeline already accepts, dormant until weather is flipped on.

---

# MODULE 2 — Wardrobe / Closet

### 🟢 Add piece from analysed photos
- **Purpose:** value-before-effort — the closet partly builds itself from onboarding photos.
- **How it works:** extracted items are presented for keep/remove (swipe), then added.
- **Data:** R/W `Piece[]`.
- **AI logic:** auto-tag (type, color, pattern, attributes).
- **UX (Hebrew/RTL):** swipe keep/remove, 3:4 cards, edit details sheet.
- **Role:** activation + habit.
- **Structure note:** same `Piece` schema for every add method, so new sources need no model change.

### 🟢 Add piece — photo library / camera
- **Purpose:** ongoing closet growth.
- **Data:** W `Piece`. **AI:** auto-tag. **Role:** habit.
- **Structure note:** shares the add pipeline above.

### 🔒 Gmail receipt import
- **Purpose:** fast closet fill from purchase history; a real moat.
- **How it works:** scan receipts (not read mail), create pieces with brand/price/date.
- **Data:** W `Piece` with `source = gmail`, `brand`, `price`.
- **UX:** explicit privacy promise ("we only scan for receipts").
- **Role:** activation. **State:** scaffolded UI now, logic later.
- **Structure note:** `Piece` already carries brand/price/source.

### ⚪ Barcode scan
- **Purpose:** add known new items.
- **Role:** convenience. **Note:** low priority (friction); reserved only.

### 🟢 Wardrobe grid + filters
- **Purpose:** core usability and a sense of ownership.
- **How it works:** grid filtered by type/color/season; favorites.
- **Data:** R `Piece[]`.
- **UX (Hebrew/RTL):** RTL grid, filter chips, 3:4 cards.
- **Role:** retention.

### 🔒 Collections
- **Purpose:** organize pieces/outfits; emotional ownership.
- **Data:** R/W `Collection`.
- **Role:** retention. **State:** scaffolded.
- **Structure note:** `Collection` object reserved; `Outfit.collection_id` already present.

### ⚪ Closet insights (gaps, cost-per-wear, most-worn)
- **Purpose:** "the AI understands my closet."
- **Data:** R `Piece.wear_count/last_worn` (future fields).
- **Role:** retention + affiliate fuel (gaps → recommendations).
- **Structure note:** wear-tracking fields reserved now.

---

# MODULE 3 — AI Styling

### 🟢 Daily outfit + reasoning (Today, hero)
- **Purpose:** the daily retention loop and the core thesis in action.
- **How it works:** one suggested look for today from the closet, with a short human explanation; regenerate / save / "למה זה?".
- **Data:** R `User.analysis`, `style_identity`, `Piece[]`, context; W `Outfit`.
- **AI logic:** full pipeline (candidate → score on color-palette + proportion + silhouette + formality + consistency → select → **reason**).
- **UX (Hebrew/RTL):** 3:4 hero, gold accent, calm; reasoning in simple warm Hebrew.
- **Role:** daily retention.
- **Structure note:** identical pipeline used by Create and Stylist, so quality is shared.

### 🟢 Smart outfit generator (Create)
- **Purpose:** on-demand outfits for any moment.
- **How it works:** generate from closet, optionally constrained by occasion/filters.
- **Data:** R `Piece[]`, context; W `Outfit`.
- **AI logic:** same pipeline.
- **Role:** engagement.

### 🟢 Build-a-fit (manual + AI assist)
- **Purpose:** user control; long-press to pick specific pieces.
- **Data:** R `Piece[]`; W `Outfit (generated_by = user|hybrid)`.
- **Role:** engagement + ownership.

### 🟢 Stylist chat (body + wardrobe aware)
- **Purpose:** emotionally intelligent advice, not a generic chatbot.
- **How it works:** ask anything ("מה אני לובש לדינר הערב?"); answers reference the user's body, palette, and actual closet.
- **Data:** R `User.analysis`, `style_identity`, `Piece[]`; may W `Outfit`.
- **AI logic:** retrieval over closet + analysis, then reasoning in-tone.
- **UX (Hebrew/RTL):** suggested prompts, RTL bubbles, warm concise Hebrew.
- **Role:** retention + premium feel.
- **Structure note:** chat consumes the same context object as the pipeline, so it stays consistent with daily looks.

### 🟢 Save look + preference learning
- **Purpose:** saving is the obvious action; the hidden value is that **saves and dismissals teach the AI what you like.**
- **How it works:** save/dismiss any look; a lightweight preference profile (favored colors, silhouettes, formality) is derived and fed back into generation, so looks get more "you" over time.
- **Data:** W `Outfit.saved`; W `User.preference_profile` (derived from saves/dismissals).
- **AI logic:** saves/dismissals → preference profile → biases the scoring step of the pipeline.
- **Role:** retention + compounding personalization (the app gets stickier the more you use it).
- **Structure note:** preference_profile is a single derived object the pipeline already reads; richer signals (wear logs) plug in later.

### 🔒 Event-based styling
- **Purpose:** high-intent moments (wedding, interview, date).
- **Data:** R closet + event type; W `Outfit (occasion)`.
- **Role:** premium conversion. **State:** scaffolded.
- **Structure note:** `Outfit.occasion` already exists.

### 🔒 Weather styling
- **Purpose:** daily relevance.
- **Data:** R location → weather context.
- **Role:** retention. **State:** scaffolded (location captured, dormant).
- **Structure note:** `Outfit.weather_context` reserved; pipeline accepts the input now.

### 🔒 Virtual try-on / digital twin
- **Purpose:** flagship wow + virality.
- **How it works:** digital twin from photos; render outfits on the user.
- **Data:** R analysis photos; W `Outfit.tryon_render_url`.
- **Role:** premium + virality. **State:** scaffolded (future flagship).
- **Structure note:** render URL field reserved on `Outfit`.

### ⚪ Rate-my-fit (visual outfit analysis)
- **Purpose:** engagement loop; feedback on an uploaded look.
- **Role:** virality. **Note:** reserved.

---

# MODULE 4 — Shopping / Monetization (built clean, off at launch)

### 🟢 Subscription paywall
- **Purpose:** premium revenue from day one; no credit-metering.
- **How it works:** clean tiers (e.g. monthly/yearly), free trial optional, value-led; testimonial.
- **Data:** R/W `User.subscription`.
- **UX (Hebrew/RTL):** premium, honest, RTL pricing; anchor the yearly plan.
- **Role:** monetization.
- **Structure note:** tier gating reads the same `features` flags used everywhere.

### 🔒 Native shopping recommendations
- **Purpose:** fill closet gaps with items that suit the user's palette/body.
- **Data:** R `closet gaps`, `analysis`; R/W `Recommendation`.
- **AI logic:** match to color_palette + proportions + style_identity.
- **Role:** affiliate revenue. **State:** scaffolded.
- **Structure note:** `Recommendation` object reserved; must read as advice, never an ad.

### 🔒 Wishlist
- **Purpose:** capture buying intent.
- **Role:** affiliate. **State:** scaffolded.

### ⚪ Sponsored-but-native picks
- **Purpose:** revenue without ad clutter.
- **Role:** monetization. **Note:** `Recommendation.sponsored` reserved; only if it still reads as genuine advice.

---

# MODULE 5 — Social (private-first, post-PMF)

### ⚪ Couple mode (flagged high-viral hook — design the data model for it now)
- **Purpose:** the strongest built-in virality lever. Two people, one shared styling experience.
- **How it works:** two profiles **link** (invite); the AI generates **coordinated / matching looks that reference *both* wardrobes and both color palettes**, for shared occasions (date night, wedding, trip). Includes a **couple style-compatibility** read.
- **Data:** R both users' `analysis`, `style_identity`, `Piece[]`; W `Outfit` referencing two `user_id`s; uses `User.social.couple_id`.
- **AI logic:** dual-input generation — harmonise palettes and formality across two people while keeping each flattering to their own body/coloring; explain *why the pair works*.
- **UX (Hebrew/RTL):** two 3:4 figures side by side, a shared look, a tasteful "compatibility" moment; built for screenshotting and sharing.
- **Role:** virality + retention (a reason a partner installs too). **State:** reserved, but the `Outfit` schema must allow multiple `user_id`s and cross-wardrobe references from day one.
- **Structure note:** this is *the* feature most likely to break the data model if not reserved now — `Outfit` is designed so a look can span two wardrobes without a rebuild.

### 🔒 Friends
- **Purpose:** trusted private feedback, not a public feed.
- **Data:** `User.social.friends` (reserved).
- **Role:** retention/virality. **State:** scaffolded.

### ⚪ Private outfit ratings · ⚪ Style compatibility · ⚪ Communities
- **Purpose:** confidence loops, differentiation, scale.
- **Role:** engagement/virality. **Note:** all reserved; guardrail — never let the app become a public social network by default.
- **Structure note:** `social` object reserved on `User`.

---

# MODULE 6 — Premium / System / Retention

### 🔒 Daily loop ("today's look" + notification)
- **Purpose:** the outer retention loop; the habit driver.
- **How it works:** each morning the app prepares today's look from the closet (considers weather + what was worn recently); a notification surfaces it. The copy is **specific and valuable even if unopened** ("בוקר. היום קצת קריר, הכנתי לך לוק מהארון שלך שלא לבשת השבוע."). Occasionally it becomes a **peak moment** (a detected event, rain tomorrow).
- **Data:** R `Piece[]`, context, recent `Outfit`s; W daily `Outfit`.
- **Role:** retention (the single biggest habit lever). **State:** scaffolded (notification permission is LIVE; the engine flips on in Phase 2).
- **Structure note:** rule baked in — **never an empty "we miss you" notification; every push carries real value.**

### ⚪ Weekly progress (flagged: strongest retention mechanic)
- **Purpose:** the feeling of earned progress; the reason the habit compounds.
- **How it works:** a weekly summary ("השבוע הסטייל שלך נעשה עקבי יותר") with real, earned stats: previously-unworn items used, style consistency, etc.
- **Data:** R historical `Outfit`/`Piece` usage, `StyleInsight`.
- **Role:** retention + defensibility. **Note:** make the numbers feel earned and real, never inflated.
- **Structure note:** outfits are timestamped from day one so this is computable later with no migration.

### 🟢 Style Identity + Color Palette profile (You)
- **Purpose:** a home for the identity the user earned; reinforces "this gets me."
- **Data:** R `User.analysis`, `style_identity`.
- **Role:** retention.

### 🟢 Settings · subscription · privacy
- **Purpose:** trust and control. **Role:** trust. **Data:** R/W `User.subscription`, account.

### ⚪ Style evolution timeline
- **Purpose:** long-term lock-in; "your style got more consistent this month."
- **Data:** R historical `Outfit`/`StyleInsight`.
- **Role:** retention + defensibility (data compounds).
- **Structure note:** `StyleInsight` reserved; outfits already timestamped.

### ⚪ Style score
- **Purpose:** elegant progress signal (not gamified loss-aversion).
- **Role:** engagement. **Note:** reserved; keep premium, never streak-spammy.

### ⚪ Packing mode · ⚪ Calendar integration
- **Purpose:** travel utility, context-aware styling.
- **Role:** retention. **Note:** reserved; both feed the existing context object.

### ⚪ Referral (minimal)
- **Purpose:** word-of-mouth.
- **Role:** growth. **Note:** intentionally minimal and **not** credit-driven, unlike Fitted.

---

## Cross-feature dependency summary

| Feature | Hard dependency |
|---|---|
| Daily outfit, Smart gen, Stylist chat | Personal Analysis + at least a few Pieces |
| Closet insights, Shopping recs | Pieces + wear-tracking (future) |
| Weather / Event styling | Context object (location/occasion) |
| Try-on | Analysis photos |
| Daily loop, Weekly progress | Pieces + timestamped Outfit history |
| Preference learning | Saves/dismissals signal |
| Social / Couple | Accounts + Friends graph + Outfit spanning two wardrobes |

## What proves the thesis (the only thing that must be perfect at launch)
**Good photos → personal analysis → Style Identity + Color Palette + first looks, all explained, that make the user feel understood.** Everything else is visible-but-locked and flips on by flag.
