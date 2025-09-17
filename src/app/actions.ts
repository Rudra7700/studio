'use server';

import {
  summarizeFieldHealth,
  SummarizeFieldHealthInput,
} from '@/ai/flows/summarize-field-health';
import { ai } from '@/ai/genkit';

export async function getTreatmentPlan(diagnosis: string) {
  try {
    const prompt = `You are an expert agricultural advisor. A crop has been diagnosed with '${diagnosis}'. 
    
    Provide a detailed treatment plan with the following sections:
    1.  **Immediate Actions:** Steps to take right away to mitigate damage.
    2.  **Pesticide/Fungicide Recommendations:** Suggest specific, commonly available products, their application rates, and methods. Mention both chemical and organic options if possible.
    3.  **Application Schedule:** A clear timeline for when and how often to apply the treatments.
    4.  **Cultural Practices:** Recommendations for non-chemical actions like pruning, irrigation changes, or soil management to support recovery and prevent future outbreaks.
    5.  **Follow-up Monitoring:** Instructions on what to look for after treatment to assess effectiveness.
    
    Format the output as clear, actionable text.`;

    const { text } = await ai.generate({ prompt });
    return { success: true, data: { treatmentRecommendations: text } };
  } catch (error) {
    console.error('Error getting treatment plan from AI:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get treatment recommendations: ${errorMessage}` };
  }
}

export async function getHealthSummary(
  input: SummarizeFieldHealthInput
) {
  try {
    const result = await summarizeFieldHealth(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get field health summary.' };
  }
}

export async function sendToAssistant(prompt: string) {
  try {
    const { text } = await ai.generate({
      prompt: `You are a friendly agricultural AI assistant. Answer queries about pesticide spraying, crop disease, weather, and drone operations in English or Hindi. User query: ${prompt}`,
    });
    return { success: true, data: { text } };
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    return { success: false, error: 'Failed to get assistant response.' };
  }
}
