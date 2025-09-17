'use server';

import {
  getTreatmentRecommendations,
  GetTreatmentRecommendationsInput,
} from '@/ai/flows/get-treatment-recommendations';
import {
  summarizeFieldHealth,
  SummarizeFieldHealthInput,
} from '@/ai/flows/summarize-field-health';
import { ai } from '@/ai/genkit';


export async function getTreatmentPlan(
  input: GetTreatmentRecommendationsInput
) {
  try {
    const result = await getTreatmentRecommendations(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get treatment recommendations.' };
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

export async function sendToAssistant(prompt: string, history: Array<{role: 'user' | 'model', text: string}>) {
  try {
    const model = ai.getModel('googleai/gemini-2.5-flash');
    
    const messages = [
        { role: 'system', text: 'You are a friendly agricultural AI assistant. Answer queries about pesticide spraying, crop disease, weather, and drone operations in English or Hindi.' },
        ...history,
        { role: 'user', text: prompt },
    ] as Array<{role: 'system' | 'user' | 'model', text: string}>;


    const response = await ai.generate({
        model: model,
        prompt: messages,
    });
    
    const text = response.text;
    if (!text) {
      throw new Error('No text in response');
    }
    return { success: true, data: { text } };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get assistant response.' };
  }
}
