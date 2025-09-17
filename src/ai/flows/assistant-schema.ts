import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string(),
});

export const AssistantInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  language: z.string().optional().describe('The language for the response (e.g., "Hindi").'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export const AssistantOutputSchema = z.object({
  text: z.string().describe("The assistant's response."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;
