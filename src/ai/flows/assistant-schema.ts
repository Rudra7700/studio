import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

export const AssistantInputSchema = z.object({
  prompt: z.string().describe("The user's current query."),
  history: z
    .array(MessageSchema)
    .describe('The conversation history.')
    .optional(),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export const AssistantOutputSchema = z.object({
  text: z.string().describe("The assistant's response."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;
