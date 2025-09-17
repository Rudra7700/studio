'use server';

import {
  summarizeFieldHealth,
  SummarizeFieldHealthInput,
} from '@/ai/flows/summarize-field-health';
import { ai } from '@/ai/genkit';
import { mockFields, mockSensorData } from '@/lib/mock-data';

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
      if ((errorMessage.includes('503') || errorMessage.includes('overloaded')  || errorMessage.includes('Service Unavailable')) && modelName !== models[models.length - 1]) {
        console.log(`Model ${modelName} is unavailable, trying next model.`);
        continue;
      }
      return { success: false, error: `Failed to get treatment recommendations: ${errorMessage}` };
    }
  }

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
