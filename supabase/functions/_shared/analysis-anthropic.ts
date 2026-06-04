import Anthropic from 'npm:@anthropic-ai/sdk';

import type {
  AnalysisInput,
  AnalysisProvider,
  AnalysisResult,
  PhotoInput,
} from '../../../lib/analysis/types.ts';
import { buildAnalysisPrompt } from '../../../lib/ai/prompts/index.ts';
import { extractJson, parseAnalysisResult } from '../../../lib/ai/validate.ts';
import { MODEL, textFromMessage } from './anthropic.ts';

/**
 * The Anthropic-vision implementation of the swappable AnalysisProvider.
 *
 * TO SWAP THE ENGINE: write another class `implements AnalysisProvider` (e.g. a
 * dedicated body/color vision service) and instantiate it in analyze/index.ts.
 * The interface, prompt contract, and validators stay the same, so the rest of
 * the app and the function body do not change.
 */

type ImageBlock =
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
  | { type: 'image'; source: { type: 'url'; url: string } };

function toImageBlock(photo: PhotoInput): ImageBlock {
  if (photo.base64) {
    return {
      type: 'image',
      source: { type: 'base64', media_type: photo.mediaType ?? 'image/jpeg', data: photo.base64 },
    };
  }
  if (photo.url) {
    return { type: 'image', source: { type: 'url', url: photo.url } };
  }
  throw new Error('Each photo must include base64 data or a url');
}

export class AnthropicAnalysisProvider implements AnalysisProvider {
  readonly id = 'anthropic-vision';

  constructor(private readonly client: Anthropic) {}

  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    const { system, instruction } = buildAnalysisPrompt(input.context);
    const images = input.photos.map(toImageBlock);

    const message = await this.client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content: [...images, { type: 'text', text: instruction }] }],
    });

    return parseAnalysisResult(extractJson(textFromMessage(message)));
  }
}
