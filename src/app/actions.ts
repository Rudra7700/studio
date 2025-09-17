'use server';

import {
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
    const prompt = `You are an expert agricultural advisor. Based on the following information, provide a detailed treatment plan.

Disease Detected: ${input.diseaseDetected}
Weather Conditions: ${input.weatherConditions}
Crop Stage: ${input.cropStage}
${input.soilAnalysis ? `Soil Analysis: ${input.soilAnalysis}` : ''}
${input.fertilizerHistory ? `Fertilizer History: ${input.fertilizerHistory}`: ''}

Provide detailed treatment recommendations, including specific products, application methods, and timing. Also contain fertilizer blend recommendations adapted to the current crop and environmental status. Give detailed instructions on how to execute the treatment plan. Provide a comprehensive plan to recover the crops back to health. Explain each step in detail. Provide the recommendations as text.`;

    const { text } = await ai.generate({ prompt });
    return { success: true, data: { treatmentRecommendations: text } };
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