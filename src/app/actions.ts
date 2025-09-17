'use server';

import {
  getTreatmentRecommendations,
  GetTreatmentRecommendationsInput,
} from '@/ai/flows/get-treatment-recommendations';
import {
  summarizeFieldHealth,
  SummarizeFieldHealthInput,
} from '@/ai/flows/summarize-field-health';

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
