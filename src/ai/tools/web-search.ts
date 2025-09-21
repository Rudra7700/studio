'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const searchWeb = ai.defineTool(
  {
    name: 'searchWeb',
    description:
      'Searches the web for the given query and returns the most relevant results. Use this for real-time information like weather, market prices, or news.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.any(),
  },
  async input => {
    // Correctly call the built-in searchWeb tool
    return await googleAI.searchWeb(input);
  }
);
