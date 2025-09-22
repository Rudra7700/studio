'use server';
/**
 * @fileOverview An AI agent for generating dynamic farming challenges.
 *
 * - generateFarmingChallenges - A function that creates a list of daily challenges.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateFarmingChallengesInput,
  GenerateFarmingChallengesInputSchema,
  GenerateFarmingChallengesOutput,
  GenerateFarmingChallengesOutputSchema,
} from './generate-farming-challenges.types';

export async function generateFarmingChallenges(
  input: GenerateFarmingChallengesInput
): Promise<GenerateFarmingChallengesOutput> {
  return generateFarmingChallengesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFarmingChallengesPrompt',
  input: {schema: GenerateFarmingChallengesInputSchema},
  output: {schema: GenerateFarmingChallengesOutputSchema},
  prompt: `You are a creative "Challenge Master" for a smart farming application. Your role is to generate engaging daily tasks for farmers to complete.

Generate a list of 3-4 unique and interesting daily challenges. The challenges should be related to modern, precision agriculture, and smart farming practices.

Vary the points based on the complexity or effort required. Simple tasks should be 5-10 points, while more involved ones can be 15-25 points.

Here are some categories to inspire you, but feel free to be creative:
- Data logging (e.g., logging soil moisture, rainfall, plant growth).
- Pest and disease scouting (e.g., inspecting a specific number of plants, uploading a photo for analysis).
- Equipment checks (e.g., calibrating a sensor, checking drone battery).
- Learning (e.g., reading a short article about a new technique).
- Community interaction (e.g., sharing a tip).

{{#if existingChallenges}}
Avoid generating challenges that are too similar to these existing ones:
{{#each existingChallenges}}
- {{{this}}}
{{/each}}
{{/if}}

Make sure each challenge has a unique ID, a clear title, a simple description, a point value, and its type is set to 'daily'. Return the list in the specified JSON format.
`,
});

const generateFarmingChallengesFlow = ai.defineFlow(
  {
    name: 'generateFarmingChallengesFlow',
    inputSchema: GenerateFarmingChallengesInputSchema,
    outputSchema: GenerateFarmingChallengesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
