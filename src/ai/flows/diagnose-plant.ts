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
  model: 'googleai/gemini-pro',
  prompt: `You are an expert botanist and plant pathologist specializing in diagnosing plant illnesses from images and recommending treatments.

You will be provided with an image of a plant and a brief description. Use this information to perform the following steps:

1.  **Identification**: Determine if the image contains a plant. If it does, identify its common and Latin names.
2.  **Diagnosis**:
    *   Assess the overall health and assign a \`healthScore\` from 0 (very sick) to 100 (perfectly healthy).
    *   Set \`isHealthy\` based on your assessment.
    *   If the plant is diseased, identify the specific disease (e.g., "Northern Corn Leaf Blight", "Powdery Mildew"). If healthy, this should be "None".
    *   Provide a \`detailedDiagnosis\` explaining your reasoning. Describe the visual symptoms (e.g., lesions, discoloration, wilting) you observe in the image and explain what they indicate.
3. **Treatment Plan**:
    * If the plant is diseased, provide a detailed treatment plan.
    * **Pesticide Recommendation**: Suggest 1-2 specific, commonly available pesticides (e.g., "Propiconazole 25% EC", "Imidacloprid 17.8% SL") suitable for the identified disease and plant.
    * **Application Instructions**: Give clear, step-by-step instructions on how to apply the treatment, including dosage (e.g., "200-300 ml per acre"), method (e.g., "Foliar spray"), and optimal timing.
    * **Safety Precautions**: List critical safety notes for handling the recommended pesticides.
    * If the plant is healthy, all fields in the 'treatment' object should be "N/A".

Your final output must be in the structured JSON format as defined in the output schema.

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
