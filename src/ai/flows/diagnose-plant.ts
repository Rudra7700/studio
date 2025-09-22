'use server';
/**
 * @fileOverview An AI agent for diagnosing plant health from an image.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A brief description of the plant or context for the image.'),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

export const DiagnosePlantOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the image contains a plant.'),
    commonName: z.string().describe('The common name of the identified plant (e.g., "Corn", "Tomato Plant").'),
    latinName: z.string().describe('The Latin or scientific name of the identified plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('A determination of whether the plant appears to be healthy or not.'),
    healthScore: z.number().min(0).max(100).describe('A score from 0 (very sick) to 100 (perfectly healthy) representing the plant\'s overall health.'),
    disease: z.string().describe('The name of the disease or issue identified. Should be "None" if the plant is healthy.'),
    detailedDiagnosis: z.string().describe("A detailed, expert analysis of the plant's health, including visual indicators and potential causes."),
  }),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
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
