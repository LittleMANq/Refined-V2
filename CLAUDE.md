# CLAUDE.md — Refined

> Source of truth, loaded every session. Read before every task. Deep specs live in `/docs` — read them when you need detail. Keep this file lean.

## 1. What we're building (one line)
**Refined**: a premium AI personal stylist. The user gives a few good photos and, within a minute, gets a personal analysis (body type, proportions, skin tone / color season), a named Style Identity, and real outfit looks, each explained. **It analyses the person first, then the clothes.**

NOT a wardrobe organizer. NOT a cheap shopping app. NOT a social network. It must feel like a luxury stylist in your pocket.

## 2. Never violate
1. Analyse the person, not just the closet (body + color is the wedge).
2. Value before effort: the wow comes from photos, before any manual wardrobe building.
3. Every recommendation is explained. The *why* is the product.
4. Premium and calm: no gamification, no streaks, no credit-metering, no ads.
5. AI-first: social is private-first and only after PMF.
6. Affirming framing only ("what makes you feel confident"), never deficit framing ("hide your flaws"). No weight-loss framing. No ranking users against each other.

## 3. Voice & copy (user-facing)
- **Hebrew-first, RTL.** All strings via an i18n dictionary (`he`/`en`), never hardcoded.
- Simple and warm, like a human stylist who cares. No fashion jargon.
- Always explain the why. **Address ONE person in the correct gender (singular), never plural/formal.** Use "דלג"/"דלגי", not "דלגו"; the i18n dictionary holds gendered string variants and serves them based on the user's captured gender.
- **Never use an em dash** (it is an AI fingerprint). Use a comma or a period.

## 4. Design tokens
- **Palette:** ink `#1B1714` · paper `#FAF7F2` · surface `#F1ECE4` · hairline `#E2DBD0` · secondary text `#8A8178` · **accent (antique gold) `#B08953`**. One accent only. No other colors, no purple, no decorative gradients.
- **Type:** Heebo (sans, hierarchy from weight contrast) + Frank Ruhl Libre (serif, hero moments only).
- **Components:** full-width pill CTAs · soft cards · 3:4 portrait garment slots · hairline dividers · generous whitespace.
- **Button color rule:** ink (`#1B1714`) is the primary action color everywhere. Gold is accent-only (rings, dots, icons, highlights). The ONE exception: the paywall / upgrade CTA may be gold, so gold reads as "the premium moment", never random.
- **Image placeholders:** warm 3:4 toned slots are intentional, reserved for real photography. They are not empty bugs.
- **Motion:** animate key moments (the Style Identity reveal), not scattered micro-animations.
- **Forbidden:** generic SaaS defaults, cluttered screens, square garment images, purple gradients, serif body text.

## 5. Guardrails (rules; for hard blocks use a hook, not just this file)
- Do NOT build social feeds, a marketplace, ads, or a credit system.
- Do NOT activate any FUTURE feature (try-on, shopping, couple mode, communities) without an explicit request. Scaffold and lock behind the `features` flag instead.
- Do NOT expose API keys on the client. All AI calls go through the server (Supabase Edge Functions). *(enforce with a PreToolUse hook)*
- Do NOT scatter AI or DB calls across UI components. Centralize in `/lib`.
- Do NOT add heavy dependencies without justification.

## 6. Stack
- **App:** Expo / React Native, TypeScript. Reanimated + Skia for premium motion. RTL via `I18nManager`.
- **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions, RLS).
- **AI:** Anthropic API for reasoning, generation, stylist chat (tone rules go in the prompt). Photo analysis (body / proportions / skin tone / color season / garment detection) is a **separate, swappable service** in `/lib/analysis` — accuracy is the #1 risk, keep it modular.
- **Support:** TanStack Query (server state) · RevenueCat (subscriptions) · Expo Notifications (daily loop) · PostHog (privacy-first analytics).

## 7. Project layout
```
/app           screens & navigation (RTL)
/components     shared UI (pill, card, 3:4 garment slot, tab bar)
/lib/ai         AI orchestration (server-callable only)
/lib/analysis   personal analysis engine (modular, swappable)
/lib/data       data access (Supabase); types match the /docs data model
/supabase       schema, RLS, edge functions
/i18n           he / en dictionaries
/docs           STRUCTURE, FEATURES, RETENTION specs (detail lives here)
```

## 8. Build commands (greenfield; confirm on scaffold)
- dev: `npx expo start`
- typecheck: `npm run typecheck` · lint: `npm run lint`
- test: `npm run test`
- build: `eas build`

## 9. Data model & features (do not improvise)
Follow `/docs/Refined_MVP_Structure.md` for the data model and AI pipeline, and `/docs/Refined_Features.md` for per-feature specs. Every feature is tagged **LIVE / SCAFFOLDED / FUTURE** — build LIVE only; scaffold the rest behind the remote `features` flag. Retention design is in `/docs/Refined_Retention_Growth.md`.

## 10. Definition of done — Phase 1
A first session must leave the user with: (a) a Style Identity they believe, (b) ~8–10 pieces in the closet, (c) at least one saved look. If a flow cannot hit that bar, it is not done.
