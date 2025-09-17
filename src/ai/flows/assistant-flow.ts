'use server';
/**
 * @fileOverview A conversational AI assistant for farmers.
 *
 * - assistant - A function that handles the conversation with the user.
 */

import {ai} from '@/ai/genkit';
import {
  AssistantInput,
  AssistantInputSchema,
  AssistantOutput,
  AssistantOutputSchema,
} from './assistant-schema';

// This is a more direct implementation that avoids complex Genkit flows for stability.
export async function assistant(
  input: AssistantInput
): Promise<AssistantOutput> {
  const model = ai.getModel('googleai/gemini-2.5-flash');

  // Construct a prompt that combines the system message, history, and the latest user message.
  const history = input.history || [];
  const latestMessage = history.pop(); // The last message is the current user query

  const prompt = [
    {
      role: 'system',
      text: `You are Agri-AI, an expert agricultural assistant designed for the "Intelligent Pesticide Sprinkling System" project for the Smart India Hackathon. Your role is to provide helpful, accurate, and concise information to farmers.

      Your expertise covers:
      - Pesticide spraying recommendations: Suggest appropriate pesticides, concentrations, and application times.
      - Crop disease identification: Help identify potential diseases from descriptions.
      - Weather-based farming advice: Give recommendations based on weather conditions.
      - Drone operation guidance: Provide information on using agricultural drones for spraying and scanning.
      
      - If the user asks a question in a different language (like Hindi), please respond in that language.
      - Keep your answers concise and to the point.
      - Be friendly and conversational.
      - If you are asked to do something outside of your capabilities, politely decline.
      
      ${
        input.language
          ? `Please provide the answer in ${input.language}.`
          : ''
      }`,
    },
    ...history.map(msg => ({role: msg.role as 'user' | 'model', text: msg.text})),
    { role: 'user', text: latestMessage?.text || '' },
  ];

  try {
    const response = await ai.generate({
      model: model,
      prompt: prompt,
      output: {
        schema: AssistantOutputSchema,
      },
    });

    const output = response.output;
    if (!output) {
      throw new Error('No output from AI model.');
    }
    return output;
  } catch (e) {
    console.error('Error generating AI response:', e);
    // Return a structured error that the frontend can display
    return {
      text: "Sorry, I'm unable to process your request at the moment. Please try again soon.",
    };
  }
}
