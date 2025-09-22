
'use server';
/**
 * @fileOverview An AI agent that generates an image of a crop.
 *
 * - generateCropImage - A function that handles the generation of a crop image.
 * - GenerateCropImageInput - The input type for the generateCropImage function.
 * - GenerateCropImageOutput - The return type for the generateCropImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCropImageInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to generate an image for.'),
});
export type GenerateCropImageInput = z.infer<
  typeof GenerateCropImageInputSchema
>;

const GenerateCropImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateCropImageOutput = z.infer<
  typeof GenerateCropImageOutputSchema
>;

export async function generateCropImage(
  input: GenerateCropImageInput
): Promise<GenerateCropImageOutput> {
  return generateCropImageFlow(input);
}

const generateCropImageFlow = ai.defineFlow(
  {
    name: 'generateCropImageFlow',
    inputSchema: GenerateCropImageInputSchema,
    outputSchema: GenerateCropImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A high-quality, photorealistic image of ${input.cropName} in a field, suitable for a professional agricultural website. The crop should be the main focus.`,
    });
    
    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return {imageUrl: media.url};
  }
);
