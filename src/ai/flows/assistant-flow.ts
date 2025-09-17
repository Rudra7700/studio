'use server';
/**
 * @fileOverview A conversational AI assistant for farmers.
 *
 * - assistant - A function that handles the conversation with the user.
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
  const prompt = ai.definePrompt({
    name: 'assistantPrompt',
    input: {schema: AssistantInputSchema},
    output: {schema: AssistantOutputSchema},
    tools: [searchWeb],
    prompt: `You are Agri-AI, an expert agricultural assistant.
Your role is to provide helpful, accurate, and concise information to farmers.
You have access to real-time web search.
Use it to answer questions about current events, weather, market prices, or anything that requires up-to-date information.

- If the user asks a question in a different language, please respond in that language.
- Keep your answers concise and to the point.
- Be friendly and conversational.
- If you are asked to do something outside of your capabilities, politely decline.

{{#if language}}
Please respond in {{language}}.
{{/if}}

Here is the conversation history:
{{#each history}}
{{#if (eq role 'user')}}
User: {{{text}}}
{{else}}
Agri-AI: {{{text}}}
{{/if}}
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

  return await assistantFlow(input);
}
