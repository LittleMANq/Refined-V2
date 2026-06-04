# Refined — Full MVP Structure & Architecture (v2)

*A luxury AI stylist in your pocket. It analyses YOU first (body type, proportions, skin tone / color season), then your clothes. Built skeleton-first: ship a thin active slice, scaffold everything else so future features snap in without rewrites.*

> v2 changes from v1: design direction set to Fitted-inspired premium (overrides the old Muse near-B&W system); magic moment is photo-analysis driven, not selfie-only and not manual wardrobe build; name confirmed as Refined. Open items to confirm are flagged ⚠️.

---

## How to read this document

| Tag | Meaning | What gets built now |
|---|---|---|
| 🟢 **LIVE** | Active at launch. Proves the core thesis. | Full UI + logic + data |
| 🔒 **SCAFFOLDED** | Visible but locked ("Coming soon" / teaser). | UI placeholder + data model, no logic |
| ⚪ **FUTURE** | Not visible at launch. Reserved in architecture only. | Data fields reserved, nothing else |

The rule: **data model + navigation + AI pipeline are built for the full vision now. Active logic is built for the LIVE slice only.** That is what makes later features cheap.

---

## 1. Locked product principles

1. **Analyse the person, not just the closet.** Body type, proportions, skin tone / color season come first. This is the wedge Fitted can't copy quickly.
2. **Value before effort.** A few good photos in, instant personal analysis + Style Identity + first looks out. The same photos seed the closet. Never gate the wow behind manual wardrobe building.
3. **Every recommendation is explained.** The *why* is the product.
4. **Emotionally intelligent.** The user should feel *understood*, not *managed*.
5. **Premium and calm.** No gamification, no credit-metering, no ad clutter.
6. **AI-first.** Social is private-first and only after PMF.
7. **Unisex core, tailored presentation** (see §3).

---

## 2. Design language (Fitted-inspired premium)

This direction supersedes the old Muse near-B&W system. Take Fitted's *look*, not its model.

- **Editorial photography is the emotional anchor.** Real styled imagery for archetypes and heroes, never icon soup. (Use original art direction, not Fitted's assets.)
- **Palette:** black / white / warm neutrals + **one signature accent** (gold-family as the starting point ⚠️ to finalize). Restraint: the accent does the premium work.
- **Type:** bold display headlines + clean sans body, sophistication from weight contrast. ⚠️ Decision to lock: allow a **serif display accent** for hero moments (Fitted-style italic) or stay all-sans? Old spec said no serif; Fitted uses it. Pick one and hold it.
- **Components:** full-width pill CTAs, soft cards, generous whitespace, hairline dividers.
- **Garment image slots:** elongated **3:4 portrait**, never square (carried over from Muse, still right).
- **Floating-card feature demos** over a phone mockup (Fitted does this well on its showcase screen).
- ⚠️ **Language & direction:** **Hebrew-first, RTL**, but architected **bilingual** — all strings via an i18n dictionary (`he`/`en`), never hardcoded, so English flips on later with no rework. (Tone rules apply to whichever language ships: simple, warm, explains the why, gender-adaptive, no em dash.)

---

## 3. Gender architecture (how "both" works)

- **Core engine is gender-agnostic:** body model, color analysis, wardrobe schema, outfit objects, reasoning.
- **Presentation layer is tailored:** onboarding language, archetypes, reference imagery, fit logic adapt to `user.style_context`.
- **Launch note (engineering, not marketing):** seed one segment's imagery/archetypes first so depth feels real; the second flips on later with zero rework.

---

## 4. The Personal Analysis Engine (the differentiator)

This is what makes Refined *Refined*. From a few good photos, derive:

- **Body type & proportions** (shoulder/waist/hip balance, height, build) → fit and silhouette logic.
- **Skin tone / color season** (warm/cool/neutral, contrast level) → personal color palette: what flatters, what to avoid.
- **Item extraction** (clothes worn in the photo) → auto-tagged pieces that seed the closet.
- **Style Identity** (named archetype, e.g. "Minimal Luxe") synthesised from the above + a couple of taste questions.

Output of onboarding = personal analysis + color palette + Style Identity + first looks, plus a starter closet. All explained in human language.

---

## 5. Information Architecture

### Bottom navigation (5 tabs, some locked)
```
[ Today ]   [ Closet ]   [ Create ]   [ Stylist ]   [ You ]
   🟢          🟢           🟢            🟢            🟢
```
> No Community/Shop tab in core nav. Those live deeper, later, so the app never defaults into a marketplace or feed.

### Onboarding (🟢 LIVE — the make-or-break flow)
- Welcome / value proposition
- Gender + style context
- Style archetype picker (editorial imagery)
- **Photo capture** (a few good full-body shots; guidance for lighting/framing)
- **Personal Analysis run** (body type, proportions, skin tone, item extraction) with a premium loading moment
- 1–2 taste questions
- **Style Identity + Color Palette reveal** ← the emotional payoff
- Soft, late sign-up (framed as *saving your result*, not a gate)
- Permissions: notifications 🟢 / location 🔒

### Tab 1 — Today (🟢 LIVE)
- Daily outfit suggestion **with reasoning** (hero)
- Quick actions: regenerate, save, "why this?"
- Weather strip 🔒 · Event styling entry 🔒 · Daily style insight ⚪

### Tab 2 — Closet (🟢 LIVE)
- Wardrobe grid (filter by type/color/season)
- Add piece: from analysed photos 🟢 / photo library 🟢 / Gmail receipt import 🔒 / barcode ⚪
- Piece detail (auto-tagged, editable)
- Collections 🔒 · Closet insights (gaps, cost-per-wear) ⚪

### Tab 3 — Create (🟢 LIVE)
- Build-a-fit (manual + AI assist) · Smart outfit generator 🟢
- Virtual try-on / digital twin 🔒 (future flagship)
- Save / log fit 🟢

### Tab 4 — Stylist (🟢 LIVE)
- AI stylist chat, wardrobe- and body-aware, emotionally intelligent
- Suggested prompts · Shopping recommendations 🔒 (affiliate-ready, off at launch) · Event styling 🔒

### Tab 5 — You (🟢 LIVE)
- Style Identity + Color Palette profile 🟢
- Style evolution timeline ⚪ · Style score ⚪
- Settings, subscription, privacy 🟢
- Friends 🔒 · Couple mode ⚪ · Referral ⚪ (minimal, not credit-driven)

---

## 6. Feature inventory (full vision)

**A. Onboarding & Analysis**
- Style archetype selection — 🟢 — emotional tone — *activation*
- Personal Analysis (body, proportions, skin tone) — 🟢 — the differentiator — *activation + word-of-mouth*
- Item extraction from photos — 🟢 — seeds closet, value-before-effort — *activation*
- Style Identity + Color Palette — 🟢 — the "this gets me" moment — *activation*
- Lifestyle/occasion profiling — 🔒 — sharper recs — *retention*
- Shopping behavior learning — ⚪ — affiliate relevance — *monetization*

**B. Wardrobe**
- Photo add + auto-tagging — 🟢 — core utility — *habit*
- Gmail receipt import — 🔒 — fast fill, real moat — *activation*
- Grid + filters — 🟢 · Collections — 🔒 · Insights/cost-per-wear — ⚪

**C. AI Styling**
- Daily outfit + reasoning — 🟢 — the thesis — *daily retention*
- Smart generator — 🟢 · Stylist chat (body+wardrobe aware) — 🟢
- Event styling — 🔒 · Weather styling — 🔒
- Rate-my-fit visual analysis — ⚪ · Virtual try-on / digital twin — 🔒 — *premium + virality*

**D. Shopping (built clean, off at launch)**
- Native recommendations — 🔒 · Wishlist — 🔒 · Sponsored-but-native — ⚪ (must read as advice, never an ad)

**E. Social (private-first, post-PMF)**
- Friends — 🔒 · Private ratings — ⚪ · Couple mode — ⚪ · Style compatibility — ⚪ · Communities — ⚪

**F. Premium / System**
- Subscription paywall — 🟢 — revenue day one
- Style evolution — ⚪ · Style score — ⚪ · Packing — ⚪ · Calendar — ⚪

---

## 7. Data model (designed for the full vision; `// future` = reserved now)

```jsonc
User {
  id, created_at,
  gender, style_context,
  analysis: {                       // Personal Analysis Engine output (LIVE)
    body_type, proportions,
    skin_tone, color_season,        // warm/cool/neutral + contrast
    color_palette: { flatters: [], avoid: [] },
    source_photos: []
  },
  style_identity: { name, archetypes: [], confidence_notes /* future */ },
  body: { height, weight, fit_preferences },
  preference_profile: {                // derived from saves/dismissals (LIVE, lightweight)
    favored_colors: [], favored_silhouettes: [], formality_bias
  },
  lifestyle /* future */, shopping_profile /* future */,
  subscription: { tier, status, renews_at },
  social /* future */: { friends: [], couple_id }
}

Piece {
  id, user_id, image_url,
  type, subtype, color, pattern, brand?, price?, season,
  attributes: { fit, silhouette, formality },
  source,                           // photo_analysis | gmail | barcode
  extracted_from_photo_id?,         // links item back to an onboarding/fit photo
  wear_count /* future */, last_worn /* future */, embedding /* future */
}

Outfit {
  id, user_ids: [],                 // usually one; TWO for couple mode (cross-wardrobe). Reserved now.
  piece_ids: [],                    // may span two wardrobes in couple mode
  occasion, weather_context /* future */,
  reasoning,                        // always present (core thesis)
  generated_by,                     // ai | user | hybrid
  saved, dismissed,                 // both are preference signal → preference_profile
  logged_at /* future */, rating /* future */,
  tryon_render_url /* future */, collection_id /* future */
}

Collection /* scaffolded */ { id, user_id, name, outfit_ids, piece_ids }
StyleInsight /* future */ { id, user_id, type, content, created_at }
Recommendation /* future */ { id, user_id, product, reason, affiliate_link, sponsored }
```

---

## 8. AI pipeline (build the shape now; only LIVE paths run at launch)

```
ANALYSE → photos → body_type, proportions, skin_tone/color_season, extracted items
INPUT   → analysis + style_identity + closet + context(occasion/weather)
STEP 1  → Candidate generation (valid combos from closet)
STEP 2  → Scoring (proportion · color-palette fit · silhouette · formality · aesthetic consistency)
STEP 3  → Selection (best for the moment)
STEP 4  → Reasoning generation  ← REQUIRED, never skipped
OUTPUT  → Outfit + human, elegant explanation
```
- The **ANALYSE** stage and the **reasoning** step are the two things Fitted lacks. Both are always on.
- Context inputs (weather/event/calendar) are pluggable: scaffolded now, activated later, no change to steps 1–4.

---

## 8b. Retention engine (two loops)

Retention is designed as two nested loops, not a pile of features:

- **Outer loop — the daily notification.** Each morning, "today's look" from the closet (weather + recently-worn aware). The push copy is specific and valuable *even unopened*; occasionally it spikes into a peak moment (a detected event, rain tomorrow). **Rule: never an empty "we miss you" notification.**
- **Inner loop — the app, where effort becomes reward.** Every item added unlocks more possible looks; every save/dismiss makes the next suggestion more "you" (`preference_profile`). The app gets stickier the more it's used.
- **The compounding layer — weekly progress.** "Your style got more consistent this week," built from real timestamped usage. Flagged in the source spec as the single strongest retention mechanic. Numbers must feel earned, never inflated.
- **The viral layer — couple mode.** Coordinated looks across two linked wardrobes; a reason a partner installs too. `Outfit` is reserved to span two users from day one so this never forces a rebuild.



- Remote `features` config controls every 🔒/⚪ feature. Flip a flag → it appears. No redeploy.
- Scaffolded UI shows tasteful "Coming soon" previews — builds anticipation and tests demand before logic is built.
- Modular tabs read from the shared data model, so adding logic to one never destabilises others.
- **Lock the design system first** (palette, accent, type scale, pill, card, 3:4 slot, RTL/LTR). Every future screen inherits it = consistent premium feel for free.

---

## 10. Build order

**Phase 0 — Foundation:** design system + data model + AI pipeline shape + 5-tab shell with scaffolded states.

**Phase 1 — LIVE MVP (ship to waiting users):** Onboarding → Personal Analysis → Style Identity + Color Palette reveal → soft sign-up → Closet (from analysed photos) → Daily outfit *with reasoning* → Create (manual + smart gen) → Stylist chat → Paywall → You. Everything else visible but locked.

**Phase 2 — Deepen (flip flags):** Gmail import · Collections · Weather · Event styling · Virtual try-on.

**Phase 3 — Expand (post-PMF):** Shopping/affiliate · Friends · Insights · Evolution tracking · second gender segment fully seeded.

**Phase 4 — Differentiate (scale):** Couple mode · Packing · Calendar · Style score · Communities.

---

*The skeleton is the full vision. The launch is one honest, beautiful, working loop: good photos in, a personal analysis and a Style Identity out, that makes someone feel understood. Ship that loop. Scaffold the rest.*
