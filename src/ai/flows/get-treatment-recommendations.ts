'use server';
/**
 * @fileOverview An AI agent that provides treatment recommendations for crops based on detected diseases, weather, and crop stage.
 *
 * - getTreatmentRecommendations - A function that handles the retrieval of treatment recommendations.
 * - GetTreatmentRecommendationsInput - The input type for the getTreatmentRecommendations function.
 * - GetTreatmentRecommendationsOutput - The return type for the getTreatmentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetTreatmentRecommendationsInputSchema = z.object({
  diseaseDetected: z
    .string()
    .describe('The name of the plant disease that has been detected.'),
  weatherConditions: z
    .string()
    .describe('The current weather conditions in the field.'),
  cropStage: z.string().describe('The current growth stage of the crop.'),
  soilAnalysis: z.string().optional().describe('Detailed soil analysis results, including nutrient levels (N, P, K), pH, and organic matter content.'),
  fertilizerHistory: z.string().optional().describe('History of fertilizer application on the field including dates, types, and amounts.'),
});
export type GetTreatmentRecommendationsInput = z.infer<
  typeof GetTreatmentRecommendationsInputSchema
>;

const GetTreatmentRecommendationsOutputSchema = z.object({
  treatmentRecommendations: z.string().describe(
    'Detailed treatment recommendations, including specific products,
    application methods, and timing. Also contains fertilizer blend recommendations adapted to the current crop and environmental status.'
  ),
});
export type GetTreatmentRecommendationsOutput = z.infer<
  typeof GetTreatmentRecommendationsOutputSchema
>;

export async function getTreatmentRecommendations(
  input: GetTreatmentRecommendationsInput
): Promise<GetTreatmentRecommendationsOutput> {
  return getTreatmentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getTreatmentRecommendationsPrompt',
  input: {schema: GetTreatmentRecommendationsInputSchema},
  output: {schema: GetTreatmentRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor providing treatment
  recommendations for crops. Based on the detected disease, weather
  conditions, and crop stage, provide detailed treatment recommendations.

  Disease Detected: {{{diseaseDetected}}}
  Weather Conditions: {{{weatherConditions}}}
  Crop Stage: {{{cropStage}}}

  {% if soilAnalysis %}
  Soil Analysis: {{{soilAnalysis}}}
  {% endif %}

  {% if fertilizerHistory %}
  Fertilizer History: {{{fertilizerHistory}}}
  {% endif %}

  Adapt fertilizer blend recommendations to current crop and environmental status.
  Give detailed instructions on how to execute the treatment plan.
  Provide a comprehensive plan to recover the crops back to health.
  Explain each step in detail.
  Provide the recommendations as text.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const getTreatmentRecommendationsFlow = ai.defineFlow(
  {
    name: 'getTreatmentRecommendationsFlow',
    inputSchema: GetTreatmentRecommendationsInputSchema,
    outputSchema: GetTreatmentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
