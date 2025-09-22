'use server';
/**
 * @fileOverview An AI agent for generating a daily farming quiz.
 *
 * - generateFarmingQuiz - A function that creates a list of quiz questions.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateFarmingQuizInput,
    GenerateFarmingQuizInputSchema,
    GenerateFarmingQuizOutput,
    GenerateFarmingQuizOutputSchema,
} from './generate-farming-quiz.types';

export async function generateFarmingQuiz(
  input: GenerateFarmingQuizInput
): Promise<GenerateFarmingQuizOutput> {
  return generateFarmingQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFarmingQuizPrompt',
  input: {schema: GenerateFarmingQuizInputSchema},
  output: {schema: GenerateFarmingQuizOutputSchema},
  prompt: `You are an agricultural expert creating a fun and educational quiz for farmers.

Generate a list of 3 unique multiple-choice questions about modern farming practices, crop science, or pest management.
Each question must have:
- A unique ID.
- The question text.
- An array of 4 possible options.
- The index of the correct answer in the options array.
- A brief explanation for the correct answer.
- A point value (between 10 and 20).

{{#if existingQuestionTitles}}
Avoid generating questions that are too similar to these existing ones:
{{#each existingQuestionTitles}}
- {{{this}}}
{{/each}}
{{/if}}

Ensure the questions are practical and relevant to a farmer in India. Return the list in the specified JSON format.
`,
});

const generateFarmingQuizFlow = ai.defineFlow(
  {
    name: 'generateFarmingQuizFlow',
    inputSchema: GenerateFarmingQuizInputSchema,
    outputSchema: GenerateFarmingQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
