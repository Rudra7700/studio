'use server';

import {
  summarizeFieldHealth,
  SummarizeFieldHealthInput,
} from '@/ai/flows/summarize-field-health';
import { ai } from '@/ai/genkit';

export async function getTreatmentPlan(diagnosis: string) {
  const models = [
    'googleai/gemini-1.5-flash',
    'googleai/gemini-1.5-pro',
    'googleai/gemini-2.5-flash'
  ];

  const prompt = `You are an expert agricultural advisor. A crop has been diagnosed with '${diagnosis}'. 
    
  Provide a detailed treatment plan with the following sections:
  1.  **Immediate Actions:** Steps to take right away to mitigate damage.
  2.  **Pesticide/Fungicide Recommendations:** Suggest specific, commonly available products, their application rates, and methods. Mention both chemical and organic options if possible.
  3.  **Application Schedule:** A clear timeline for when and how often to apply the treatments.
  4.  **Cultural Practices:** Recommendations for non-chemical actions like pruning, irrigation changes, or soil management to support recovery and prevent future outbreaks.
  5.  **Follow-up Monitoring:** Instructions on what to look for after treatment to assess effectiveness.
  
  Format the output as clear, actionable text.`;

  for (const modelName of models) {
    try {
      console.log(`Attempting to get treatment plan with model: ${modelName}`);
      const { text } = await ai.generate({ 
        model: modelName,
        prompt 
      });
      console.log(`Successfully got treatment plan with model: ${modelName}`);
      return { success: true, data: { treatmentRecommendations: text } };
    } catch (error: any) {
      console.error(`Error with model ${modelName}:`, error);
      const errorMessage = error.message || 'An unknown error occurred.';
      // If the model is overloaded or unavailable, and it's not the last model in the list, continue to the next one.
      if ((errorMessage.includes('503') || errorMessage.includes('overloaded')) && modelName !== models[models.length - 1]) {
        console.log(`Model ${modelName} is overloaded, trying next model.`);
        continue;
      }
      // For the last model or for other types of errors, return the error.
      return { success: false, error: `Failed to get treatment recommendations: ${errorMessage}` };
    }
  }

  // This will only be reached if the loop completes without returning, which shouldn't happen with the logic above.
  return { success: false, error: 'All models are currently unavailable. Please try again in a few minutes.' };
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
