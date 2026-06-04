import type { GenerateOutfitInput } from '../../../lib/ai/types.ts';
import { selectOutfit } from '../../../lib/ai/pipeline.ts';
import { buildOutfitReasoningPrompt } from '../../../lib/ai/prompts/index.ts';
import { ensureReasoning, sanitizeNoEmDash } from '../../../lib/ai/validate.ts';
import { getAnthropic, MODEL, textFromMessage } from '../_shared/anthropic.ts';
import { fail, json, preflight } from '../_shared/http.ts';

/**
 * `generate-outfit` — ANALYSE -> candidate -> score -> select (deterministic,
 * /lib/ai/pipeline) -> REASON (Anthropic). Returns the outfit with a non-empty
 * Hebrew reasoning that references proportions, palette, and occasion.
 */
Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const input = (await req.json()) as GenerateOutfitInput;
    if (!input?.closet?.length) return fail('closet is required', 422);

    const selection = selectOutfit(input);
    if (!selection) {
      return fail('Not enough closet pieces to build a look', 422, { need_more_pieces: true });
    }

    const { system, instruction } = buildOutfitReasoningPrompt(input, selection);
    const client = getAnthropic();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system,
      messages: [{ role: 'user', content: instruction }],
    });
    const reasoning = ensureReasoning(sanitizeNoEmDash(textFromMessage(message)));

    return json({
      piece_ids: selection.piece_ids,
      occasion: input.context?.occasion ?? null,
      reasoning,
      generated_by: 'ai',
      score: selection.score,
    });
  } catch (err) {
    return fail('Outfit generation failed', 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
