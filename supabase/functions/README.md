# Edge Functions (server-side AI)

Deno functions that call the Anthropic API. The Anthropic key lives ONLY here, in
the function environment (a Supabase secret) — never in the app, never in `/lib`,
never committed.

## Functions

| Function          | Does                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| `analyze`         | Photos -> structured personal analysis + the magic-moment contract.  |
| `generate-outfit` | Closet -> deterministic candidate/score/select -> Hebrew reasoning.  |
| `stylist-chat`    | Wardrobe- and body-aware conversation in the Refined voice.          |

## Architecture (the interface boundary)

The pure engine logic — the `AnalysisProvider` interface, types, voice rules, the
candidate/score/select pipeline, prompt builders, and validators — lives in
`/lib/analysis` and `/lib/ai` (no SDK, no secrets, RN- and Deno-safe). These
functions import that shared logic and add only the server pieces: the Anthropic
client (`_shared/anthropic.ts`), HTTP/CORS helpers (`_shared/http.ts`), and the
Anthropic-vision implementation of the analysis engine
(`_shared/analysis-anthropic.ts`).

### Swapping the analysis engine

`AnthropicAnalysisProvider implements AnalysisProvider`. To swap in a different
engine (e.g. a dedicated body/color vision service), write another class that
`implements AnalysisProvider` and change the one line in `analyze/index.ts` that
constructs the provider. The interface, prompt contract, validators, and the app
client wrapper do not change.

## Deploy

```bash
export SUPABASE_ACCESS_TOKEN=...                 # account token (not committed)
# Anthropic key as a function secret (server-only):
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref pvltelvkoatviseadghr
# optional model override (defaults to claude-sonnet-4-6):
# npx supabase secrets set ANTHROPIC_MODEL=claude-sonnet-4-6 --project-ref pvltelvkoatviseadghr

npx supabase functions deploy analyze generate-outfit stylist-chat \
  --project-ref pvltelvkoatviseadghr --use-api
```

Supabase injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into deployed
functions automatically, so the stale key in `keys.txt` is irrelevant here.

Functions deploy with `verify_jwt = true`: the app calls them via
`supabase.functions.invoke`, which attaches the signed-in user's JWT.
