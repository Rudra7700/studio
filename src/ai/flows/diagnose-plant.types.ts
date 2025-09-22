/**
 * @fileOverview Types and schemas for the plant diagnosis AI agent.
 *
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantInputSchema - The Zod schema for the input.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 * - DiagnosePlantOutputSchema - The Zod schema for the output.
 */

import {z} from 'genkit';

export const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .describe('A brief description of the plant or context for the image.'),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

export const DiagnosePlantOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the image contains a plant.'),
    commonName: z
      .string()
      .describe(
        'The common name of the identified plant (e.g., "Corn", "Tomato Plant").'
      ),
    latinName: z
      .string()
      .describe('The Latin or scientific name of the identified plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z
      .boolean()
      .describe(
        'A determination of whether the plant appears to be healthy or not.'
      ),
    healthScore: z
      .number()
      .min(0)
      .max(100)
      .describe(
        "A score from 0 (very sick) to 100 (perfectly healthy) representing the plant's overall health."
      ),
    disease: z
      .string()
      .describe(
        'The name of the disease or issue identified. Should be "None" if the plant is healthy.'
      ),
    detailedDiagnosis: z
      .string()
      .describe(
        "A detailed, expert analysis of the plant's health, including visual indicators and potential causes."
      ),
  }),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;
