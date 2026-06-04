# Refined

A premium AI personal stylist (Hebrew-first, RTL). It analyses the person first
(body type, proportions, skin tone / color season), then the clothes.

`CLAUDE.md` is the source of truth. Full specs live in `/docs`.

## Stack

Expo / React Native + TypeScript (Expo Router) · Supabase (Postgres, Auth,
Storage, Edge Functions) · Anthropic for reasoning and vision · TanStack Query ·
Reanimated + Skia.

## Status — Phase 0 (foundation)

Scaffold only: folder structure, i18n + RTL, Supabase client, TanStack Query
provider, and a placeholder Today screen. No product features yet.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Supabase project URL and
   publishable / anon key. Never put the service-role key in the app.
3. `npm run dev`, then open in Expo Go or a simulator.

## Scripts

| Script              | What it does               |
| ------------------- | -------------------------- |
| `npm run dev`       | Start the Expo dev server  |
| `npm run typecheck` | `tsc --noEmit`             |
| `npm run lint`      | ESLint (eslint-config-expo)|
| `npm test`          | Jest (jest-expo)           |
| `npm run format`    | Prettier                   |

## Layout (CLAUDE.md §7)

```
/app           screens & navigation (RTL)
/components     shared UI (built in Prompt 2)
/lib/ai         AI orchestration (server-callable only)
/lib/analysis   personal analysis engine (modular, swappable)
/lib/data       data access (Supabase)
/supabase       schema, RLS, edge functions
/i18n           he / en dictionaries
/docs           STRUCTURE, FEATURES, RETENTION specs
```
