
'use server';

import { textToSpeechFlow } from "@/ai/flows/text-to-speech";
import type { TextToSpeechInput, TextToSpeechOutput } from "@/ai/flows/text-to-speech";


// This function is the server action that can be called from client components.
export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}
