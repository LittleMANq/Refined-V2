# /lib/ai

AI orchestration: outfit generation with reasoning, and stylist chat prompts.

Server-callable only. All Anthropic calls run inside Supabase Edge Functions; the
Anthropic key NEVER appears in the client. The app invokes these via
`supabase.functions.invoke`. Production prompts live here and are versioned.

Built in Prompt 4. See CLAUDE.md §6 and /docs/Refined_MVP_Structure.md §8.
