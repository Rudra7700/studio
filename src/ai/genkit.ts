import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {genkitEval} from '@genkit-ai/eval';

export const ai = genkit({
  plugins: [
    googleAI({
      tools: ['searchWeb'],
    }),
    genkitEval(),
  ],
  model: 'googleai/gemini-2.5-flash',
});
