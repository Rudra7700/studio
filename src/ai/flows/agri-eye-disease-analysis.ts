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
      "A high-resolution 224x224x3 RGB image of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AgriEyeDiseaseAnalysisInput = z.infer<typeof AgriEyeDiseaseAnalysisInputSchema>;

/**
 * Defines the structured JSON output from the Agri-Eye model.
 * This format is critical for integration with downstream control systems (drones, sprayers).
 */
export const AgriEyeDiseaseAnalysisOutputSchema = z.object({
  health_status: z
    .enum(["healthy", "diseased"])
    .describe("Binary classification result: 'healthy' or 'diseased'."),
  confidence: z
    .number()
    .describe("The confidence score (0.0 to 1.0) for the health_status classification."),
  disease_type: z
    .string()
    .describe("The identified disease name (e.g., 'powdery_mildew', 'rust') if status is 'diseased'."),
  disease_confidence: z
    .number()
    .describe("The confidence score for the identified disease type."),
  infection_severity: z
    .number()
    .describe("The infection coverage percentage on the leaf surface (0-100%)."),
  affected_area_pixels: z
    .number()
    .describe("The total number of pixels identified as affected by the disease."),
  total_leaf_pixels: z
    .number()
    .describe("The total number of pixels corresponding to the leaf area."),
  infection_level: z
    .enum(["Level 0: Healthy", "Level 1: Mild", "Level 2: Moderate", "Level 3: Severe"])
    .describe("The classified severity level based on infection percentage."),
  recommended_action: z
    .enum(["no_action", "preventive_spray", "targeted_treatment", "intensive_treatment", "immediate_treatment_required"])
    .describe("The recommended action based on the severity level."),
  treatment_intensity: z
    .enum(["none", "low", "medium", "high"])
    .describe("The suggested intensity for the treatment action."),
  coordinates: z
    .array(
      z.tuple([z.number(), z.number(), z.number(), z.number()])
    )
    .describe("An array of bounding boxes [x1, y1, x2, y2] for all detected infected zones."),
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

    // Mock response simulating a moderately infected leaf based on the new spec
    return {
      health_status: "diseased",
      confidence: 0.97,
      disease_type: "powdery_mildew",
      disease_confidence: 0.94,
      infection_severity: 38.5,
      affected_area_pixels: 19280,
      total_leaf_pixels: 50078, // 224 * 224
      infection_level: "Level 2: Moderate",
      recommended_action: "targeted_treatment",
      treatment_intensity: "medium",
      coordinates: [
        [110, 150, 180, 240], 
        [200, 280, 250, 330]
      ]
    };
  }
);
