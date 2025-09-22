/**
 * @fileOverview Types and schemas for the farming quiz generation AI agent.
 */

import {z} from 'genkit';

export const QuizQuestionSchema = z.object({
    id: z.string().describe("A unique identifier for the question."),
    question: z.string().describe("The text of the quiz question."),
    options: z.array(z.string()).length(4).describe("An array of 4 possible answers."),
    correctAnswerIndex: z.number().min(0).max(3).describe("The index of the correct answer in the options array."),
    explanation: z.string().describe("A brief explanation for why the answer is correct."),
    points: z.number().describe("The number of points awarded for a correct answer."),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const GenerateFarmingQuizInputSchema = z.object({
  existingQuestionTitles: z.array(z.string()).optional().describe("A list of titles of existing questions to avoid duplicates."),
});
export type GenerateFarmingQuizInput = z.infer<typeof GenerateFarmingQuizInputSchema>;

export const GenerateFarmingQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe("An array of newly generated quiz questions."),
});
export type GenerateFarmingQuizOutput = z.infer<typeof GenerateFarmingQuizOutputSchema>;
