'use server';
/**
 * @fileOverview A conversational AI assistant flow.
 *
 * - assistant - A function that handles the conversational assistant logic.
 */

import {ai} from '@/ai/genkit';
import {searchWeb} from '@/ai/tools/web-search';
import {
  AssistantInput,
  AssistantInputSchema,
  AssistantOutput,
  AssistantOutputSchema,
} from './assistant-schema';

export async function assistant(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {schema: AssistantInputSchema},
  output: {schema: AssistantOutputSchema},
  tools: [searchWeb],
  prompt: `You are a friendly agricultural AI assistant.
  Answer queries about pesticide spraying, crop disease, weather, and drone operations in English or Hindi.
  Use the searchWeb tool for real-time information.
  Conversation History:
  {{#each history}}
  - {{role}}: {{text}}
  {{/each}}
  `,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
