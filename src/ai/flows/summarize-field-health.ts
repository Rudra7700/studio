'use server';

/**
 * @fileOverview Summarizes the overall health of a field based on drone scans and sensor data.
 *
 * - summarizeFieldHealth - A function that summarizes the field health.
 * - SummarizeFieldHealthInput - The input type for the summarizeFieldHealth function.
 * - SummarizeFieldHealthOutput - The return type for the summarizeFieldHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFieldHealthInputSchema = z.object({
  fieldId: z.string().describe('The ID of the field to summarize.'),
  droneScanData: z
    .string()
    .describe('Recent drone scan data, including plant health metrics.'),
  sensorData: z
    .string()
    .describe('Recent sensor data, including soil moisture, humidity, and temperature.'),
});
export type SummarizeFieldHealthInput = z.infer<typeof SummarizeFieldHealthInputSchema>;

const SummarizeFieldHealthOutputSchema = z.object({
  summary: z.string().describe('A summary of the overall health of the field.'),
  urgentProblems: z
    .string()
    .describe('A list of any urgent problems that need to be addressed.'),
});
export type SummarizeFieldHealthOutput = z.infer<typeof SummarizeFieldHealthOutputSchema>;

export async function summarizeFieldHealth(
  input: SummarizeFieldHealthInput
): Promise<SummarizeFieldHealthOutput> {
  return summarizeFieldHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFieldHealthPrompt',
  input: {schema: SummarizeFieldHealthInputSchema},
  output: {schema: SummarizeFieldHealthOutputSchema},
  prompt: `You are an expert agricultural advisor. You are provided with drone scan data and sensor data for a field.

  Drone Scan Data:
  {{droneScanData}}

  Sensor Data:
  {{sensorData}}

  Based on this information, provide a summary of the overall health of the field, and list any urgent problems that need to be addressed. Be concise.
  `,
});

const summarizeFieldHealthFlow = ai.defineFlow(
  {
    name: 'summarizeFieldHealthFlow',
    inputSchema: SummarizeFieldHealthInputSchema,
    outputSchema: SummarizeFieldHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
