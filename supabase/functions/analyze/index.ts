import type { AnalysisInput } from '../../../lib/analysis/types.ts';
import { AnthropicAnalysisProvider } from '../_shared/analysis-anthropic.ts';
import { getAnthropic } from '../_shared/anthropic.ts';
import { fail, json, preflight } from '../_shared/http.ts';

/**
 * `analyze` — the personal-analysis magic moment. Photos in, structured analysis
 * out (body, color season, palette, extracted items, Style Identity, looks,
 * next item). Runs the swappable AnalysisProvider; swap the engine by changing
 * the one line that constructs the provider.
 */
Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const input = (await req.json()) as AnalysisInput;
    if (!input?.photos?.length) return fail('At least one photo is required', 422);
    if (!input?.context?.gender) return fail('context.gender is required', 422);

    const provider = new AnthropicAnalysisProvider(getAnthropic());
    const result = await provider.analyze(input);
    return json(result);
  } catch (err) {
    return fail('Analysis failed', 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
