'use server';
/**
 * @fileOverview The "Agri-Eye" computer vision model for real-time plant disease analysis.
 *
 * This file defines the machine learning model's interface for the Agri-Eye system.
 * It is designed to analyze plant leaf images, detect diseases, quantify infection severity,
 * and provide localization data for targeted treatment.
 *
 * - agriEyeDiseaseAnalysis - A function that simulates the analysis process.
 * - AgriEyeDiseaseAnalysisInput - The input type, expecting a high-resolution image.
 * - AgriEyeDiseaseAnalysisOutput - The structured JSON output required for control system integration.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input for the Agri-Eye model, which is a single high-resolution RGB image.
 */
export const AgriEyeDiseaseAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A high-resolution RGB image of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AgriEyeDiseaseAnalysisInput = z.infer<typeof AgriEyeDiseaseAnalysisInputSchema>;

/**
 * Defines the structured JSON output from the Agri-Eye model.
 * This format is critical for integration with downstream control systems (drones, sprayers).
 */
export const AgriEyeDiseaseAnalysisOutputSchema = z.object({
  is_healthy: z
    .boolean()
    .describe("Classification result: true if the leaf is healthy, false if diseased."),
  disease_name: z
    .string()
    .describe("The identified disease name (e.g., 'Late Blight', 'Powdery Mildew') if is_healthy is false."),
  disease_confidence: z
    .number()
    .describe("The confidence score (0.0 to 1.0) for the disease identification."),
  infection_severity_level: z
    .enum(["Level 0: Healthy", "Level 1: Mild", "Level 2: Moderate", "Level 3: Severe"])
    .describe("The quantified severity level of the infection based on leaf area coverage."),
  infected_area_percentage: z
    .number()
    .describe("The estimated percentage of the leaf surface area that is infected."),
  infected_zones: z
    .array(
      z.object({
        bounding_box: z.tuple([z.number(), z.number(), z.number(), z.number()])
          .describe("The [x, y, width, height] coordinates of the detected infected zone."),
        confidence: z
          .number()
          .describe("The confidence score for the localization of this specific infected zone.")
      })
    ).describe("An array of all localized infected areas on the leaf."),
  recommended_action: z
    .string()
    .describe("The recommended next step for the control system (e.g., 'Initiate targeted spraying')."),
});
export type AgriEyeDiseaseAnalysisOutput = z.infer<typeof AgriEyeDiseaseAnalysisOutputSchema>;


/**
 * Main function to call the Agri-Eye disease analysis model.
 * @param input The image data to be analyzed.
 * @returns A promise that resolves to the structured analysis output.
 */
export async function agriEyeDiseaseAnalysis(
  input: AgriEyeDiseaseAnalysisInput
): Promise<AgriEyeDiseaseAnalysisOutput> {
  // In a real implementation, this would pass the input to the trained model.
  // For now, it calls the flow which returns a mock response.
  return agriEyeDiseaseAnalysisFlow(input);
}


const agriEyeDiseaseAnalysisFlow = ai.defineFlow(
  {
    name: 'agriEyeDiseaseAnalysisFlow',
    inputSchema: AgriEyeDiseaseAnalysisInputSchema,
    outputSchema: AgriEyeDiseaseAnalysisOutputSchema,
  },
  async (input) => {
    //
    // **MODEL INTEGRATION POINT**
    //
    // This is where the call to the actual computer vision model would be made.
    // The model would be running on an edge device (like an NVIDIA Jetson) or a cloud endpoint.
    // The `input.imageDataUri` would be passed to the model, and the model's JSON output
    // would be returned from this flow.
    //
    // For demonstration purposes, we are returning a hardcoded, mock JSON object
    // that conforms to the specified output schema.

    console.log(`Simulating Agri-Eye analysis for image: ${input.imageDataUri.substring(0, 50)}...`);

    // Mock response simulating a moderately infected leaf
    return {
      is_healthy: false,
      disease_name: "Late Blight",
      disease_confidence: 0.96,
      infection_severity_level: "Level 2: Moderate",
      infected_area_percentage: 25.5,
      infected_zones: [
        {
          bounding_box: [150, 200, 80, 120], // Mock coordinates: [x, y, width, height]
          confidence: 0.98
        },
        {
            bounding_box: [300, 350, 50, 60],
            confidence: 0.95
        }
      ],
      recommended_action: "Initiate targeted spraying at specified coordinates."
    };
  }
);
