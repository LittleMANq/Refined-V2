import Anthropic from 'npm:@anthropic-ai/sdk';

/**
 * Anthropic client + model, built from the function's SERVER environment.
 * The key (ANTHROPIC_API_KEY) is a Supabase function secret. It never appears in
 * the app, in /lib, or in git. Set it with:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 */

export const MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-4-6';

export function getAnthropic(): Anthropic {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in the function environment');
  }
  return new Anthropic({ apiKey });
}

type TextBlock = { type: string; text?: string };

/** Concatenate the text blocks of an Anthropic message. */
export function textFromMessage(message: { content: TextBlock[] }): string {
  return message.content
    .filter((b) => b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text as string)
    .join('\n')
    .trim();
}
