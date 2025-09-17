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
