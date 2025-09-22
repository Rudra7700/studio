/**
 * @fileOverview Types and schemas for the farming challenge generation AI agent.
 */

import {z} from 'genkit';

export const ChallengeSchema = z.object({
    id: z.string().describe("A unique identifier for the challenge, e.g., 'task-1'."),
    title: z.string().describe("The short, engaging title of the challenge."),
    description: z.string().describe("A brief, clear description of what the farmer needs to do."),
    points: z.number().describe("The number of points awarded for completing the challenge."),
    type: z.enum(['daily', 'weekly']).describe("The type of challenge."),
});

export const GenerateFarmingChallengesInputSchema = z.object({
  farmerLevel: z.number().min(1).optional().describe("The farmer's current level or experience."),
  existingChallenges: z.array(z.string()).optional().describe("A list of titles of existing challenges to avoid generating duplicates."),
});
export type GenerateFarmingChallengesInput = z.infer<typeof GenerateFarmingChallengesInputSchema>;

export const GenerateFarmingChallengesOutputSchema = z.object({
  challenges: z.array(ChallengeSchema).describe("An array of newly generated farming challenges."),
});
export type GenerateFarmingChallengesOutput = z.infer<typeof GenerateFarmingChallengesOutputSchema>;
