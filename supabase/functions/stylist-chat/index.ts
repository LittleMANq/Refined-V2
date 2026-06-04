import type { StylistChatInput } from '../../../lib/ai/types.ts';
import { buildChatPrompt } from '../../../lib/ai/prompts/index.ts';
import { sanitizeNoEmDash } from '../../../lib/ai/validate.ts';
import { getAnthropic, MODEL, textFromMessage } from '../_shared/anthropic.ts';
import { fail, json, preflight } from '../_shared/http.ts';

/**
 * `stylist-chat` — wardrobe- and body-aware conversation in the Refined voice.
 * Answers reference the user's analysis, palette, and actual closet pieces.
 */
Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const input = (await req.json()) as StylistChatInput;
    if (!input?.messages?.length) return fail('messages are required', 422);

    const { system, messages } = buildChatPrompt(input);
    const client = getAnthropic();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const reply = sanitizeNoEmDash(textFromMessage(message)).trim();
    if (!reply) return fail('Empty reply from model', 502);

    return json({ reply });
  } catch (err) {
    return fail('Stylist chat failed', 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
