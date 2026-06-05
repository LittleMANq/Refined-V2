import type { DetectGarmentsInput } from '../../../lib/analysis/types.ts';
import { AnthropicAnalysisProvider } from '../_shared/analysis-anthropic.ts';
import { getAnthropic } from '../_shared/anthropic.ts';
import { fail, json, preflight } from '../_shared/http.ts';

/**
 * `detect-garments` — one photo in, a list of distinct garments out, each tagged
 * (Hebrew) and with a normalized bounding region. The app shows them as selectable
 * cards; each pick is then cropped (crop-garment) into its own slot image. Runs the
 * SAME swappable AnalysisProvider as `analyze`. Anthropic key is server-side only.
 */
Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') return fail('Method not allowed', 405);

  try {
    const input = (await req.json()) as DetectGarmentsInput;
    if (!input?.photo?.base64 && !input?.photo?.url) {
      return fail('A photo (base64 or url) is required', 422);
    }

    const provider = new AnthropicAnalysisProvider(getAnthropic());
    const result = await provider.detectGarments(input);
    return json(result);
  } catch (err) {
    return fail('Detection failed', 500, {
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
