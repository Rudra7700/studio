
'use server';

import {
  summarizeFieldHealth,
  SummarizeFieldHealthInput,
} from '@/ai/flows/summarize-field-health';
import { ai } from '@/ai/genkit';
import { mockFields, mockSensorData } from '@/lib/mock-data';
import {
  getTreatmentRecommendations,
  GetTreatmentRecommendationsInput,
} from '@/ai/flows/get-treatment-recommendations';
import { generateCropImage, GenerateCropImageInput } from '@/ai/flows/generate-crop-image';
import { diagnosePlant } from '@/ai/flows/diagnose-plant';
import type { DiagnosePlantInput, DiagnosePlantOutput } from '@/ai/flows/diagnose-plant.types';
import { generateFarmingChallenges, GenerateFarmingChallengesInput } from '@/ai/flows/generate-farming-challenges';
import type { Challenge } from '@/lib/types';
import { generateFarmingQuiz } from '@/ai/flows/generate-farming-quiz';
import type { QuizQuestion } from '@/ai/flows/generate-farming-quiz.types';
import { textToSpeech } from '@/ai/actions/text-to-speech';


export async function generateCropReport(fieldId: string) {
  const field = mockFields.find(f => f.id === fieldId);
  if (!field) {
    return { success: false, error: 'Field not found.' };
  }
  
  const prompt = `You are an expert agronomist. Generate a concise crop status report for field "${field.name}" which is growing ${field.cropType}.
  
  Current field health status: ${field.healthStatus}.
  Recent sensor data:
  - Soil Moisture: ${mockSensorData.soilMoisture}%
  - Temperature: ${mockSensorData.temperature}°C
  - Humidity: ${mockSensorData.humidity}%
  
  Based on this data, provide a narrative summary of the current crop status and soil conditions.
  Conclude with a short, actionable list of recommended next steps for the farmer.
  Format the entire output as plain text, using line breaks for readability.`;
  
  try {
    const { text } = await ai.generate({ prompt });
    return { success: true, data: { report: text } };
  } catch (error: any) {
    console.error(`Error generating crop report for field ${fieldId}:`, error);
    return { success: false, error: 'Failed to generate AI report. The model may be overloaded.' };
  }
}

export async function getTreatmentPlan(
  input: GetTreatmentRecommendationsInput
) {
  const models = [
    'googleai/gemini-1.5-flash',
    'googleai/gemini-1.5-pro',
    'googleai/gemini-2.5-flash',
  ];

  for (const modelName of models) {
    try {
      console.log(`Attempting to get treatment plan with model: ${modelName}`);
      const response = await getTreatmentRecommendations(input);
      console.log(`Successfully got treatment plan with model: ${modelName}`);
      return { success: true, data: response };
    } catch (error: any) {
      console.error(`Error with model ${modelName}:`, error);
      const errorMessage = error.message || 'An unknown error occurred.';
      if (
        (errorMessage.includes('503') ||
          errorMessage.includes('overloaded') ||
          errorMessage.includes('Service Unavailable')) &&
        modelName !== models[models.length - 1]
      ) {
        console.log(`Model ${modelName} is unavailable, trying next model.`);
        continue;
      }
      return {
        success: false,
        error: `Failed to get treatment recommendations: ${errorMessage}`,
      };
    }
  }

  return {
    success: false,
    error:
      'All models are currently unavailable. Please try again in a few minutes.',
  };
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

export async function sendToAssistant(prompt: string, generateAudio: boolean) {
  try {
    const { text } = await ai.generate({
      prompt: `You are a friendly agricultural AI assistant. Answer queries about pesticide spraying, crop disease, weather, and drone operations in English or Hindi. User query: ${prompt}`,
    });

    if (generateAudio) {
        const audioResponse = await textToSpeech(text);
        return { success: true, data: { text, audioDataUri: audioResponse.media } };
    }

    return { success: true, data: { text, audioDataUri: null } };
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    return { success: false, error: 'Failed to get assistant response.' };
  }
}

export async function getCropImage(input: GenerateCropImageInput) {
    try {
        const result = await generateCropImage(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error generating crop image:', error);
        return { success: false, error: 'Failed to generate crop image.' };
    }
}

export async function diagnosePlantHealth(input: DiagnosePlantInput): Promise<{ success: boolean; data?: DiagnosePlantOutput; error?: string }> {
    try {
        const result = await diagnosePlant(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error diagnosing plant health:', error);
        return { success: false, error: 'Failed to analyze the image with AI. ' + error.message };
    }
}

export async function getAiChallenges(input: GenerateFarmingChallengesInput): Promise<{ success: boolean; data?: Challenge[]; error?: string }> {
    try {
        const result = await generateFarmingChallenges(input);
        // The schema returns an object with a 'challenges' property
        return { success: true, data: result.challenges };
    } catch (error: any) {
        console.error('Error generating farming challenges:', error);
        return { success: false, error: 'Failed to generate new challenges from AI. ' + error.message };
    }
}

export async function getAiQuiz(): Promise<{ success: boolean; data?: QuizQuestion[]; error?: string; }> {
    try {
        const result = await generateFarmingQuiz({});
        return { success: true, data: result.questions };
    } catch (error: any) {
        console.error('Error generating farming quiz:', error);
        return { success: false, error: 'Failed to generate a new quiz from AI. ' + error.message };
    }
}
