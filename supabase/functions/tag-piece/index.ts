import type { GarmentTagInput } from '../../../lib/analysis/types.ts';
import { AnthropicAnalysisProvider } from '../_shared/analysis-anthropic.ts';
import { getAnthropic } from '../_shared/anthropic.ts';
import { fail, json, preflight } from '../_shared/http.ts';

/**
 * `tag-piece` — single-garment auto-tagging for the library / camera add flow.
 * One garment photo in, Piece tags out (type, subtype, color, pattern, attributes),
 * all Hebrew. Runs the SAME swappable AnalysisProvider as `analyze` (one engine,
 * two entry points); swap the engine by changing the line that constructs it.
 *
 * The Anthropic key lives only in this function's server environment, never on the
 * client. Tagging failures surface as a 500 so the app can save the piece anyway
 * (graceful "needs details"), rather than blocking the add.
 */
Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const input = (await req.json()) as GarmentTagInput;
    if (!input?.photo?.base64 && !input?.photo?.url) {
      return fail('A garment photo (base64 or url) is required', 422);
    }

    const provider = new AnthropicAnalysisProvider(getAnthropic());
    const tag = await provider.tagGarment(input);
    return json(tag);
  } catch (err) {
    return fail('Tagging failed', 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
