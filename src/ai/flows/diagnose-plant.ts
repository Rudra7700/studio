'use server';
/**
 * @fileOverview An AI agent for diagnosing plant health from an image.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 */

import {ai} from '@/ai/genkit';
import {
  DiagnosePlantInput,
  DiagnosePlantInputSchema,
  DiagnosePlantOutput,
  DiagnosePlantOutputSchema,
} from './diagnose-plant.types';

export async function diagnosePlant(
  input: DiagnosePlantInput
): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  model: 'googleai/gemini-pro-vision',
  prompt: `You are an expert botanist and plant pathologist specializing in diagnosing plant illnesses from images.

You will be provided with an image of a plant and a brief description. Use this information to first identify the plant and then provide a detailed diagnosis of its health.

1.  **Identification**: Determine if the image contains a plant. If it does, identify its common and Latin names.
2.  **Diagnosis**:
    *   Assess the overall health and assign a \`healthScore\` from 0 (very sick) to 100 (perfectly healthy).
    *   Set \`isHealthy\` based on your assessment.
    *   If the plant is diseased, identify the specific disease (e.g., "Northern Corn Leaf Blight", "Powdery Mildew"). If healthy, this should be "None".
    *   Provide a \`detailedDiagnosis\` explaining your reasoning. Describe the visual symptoms (e.g., lesions, discoloration, wilting) you observe in the image and explain what they indicate.

Your final output must be in the structured JSON format.

**User Provided Information:**

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
