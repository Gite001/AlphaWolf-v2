'use server';
/**
 * @fileOverview AI agent for generating an ad visual from a prompt.
 *
 * - generateAdImage - A function that handles ad image generation.
 * - GenerateAdImageInput - The input type for the generateAdImage function.
 * - GenerateAdImageOutput - The return type for the generateAdImage function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdImageInputSchema = z.string().describe('A detailed visual prompt for the image generation model.');
export type GenerateAdImageInput = z.infer<typeof GenerateAdImageInputSchema>;

const GenerateAdImageOutputSchema = z.object({
  imageUrl: z.string().nullable().describe('The data URI of the generated ad visual. Null if generation failed.'),
});
export type GenerateAdImageOutput = z.infer<typeof GenerateAdImageOutputSchema>;


export async function generateAdImage(input: GenerateAdImageInput): Promise<GenerateAdImageOutput> {
  return generateAdImageFlow(input);
}

const generateAdImageFlow = ai.defineFlow(
  {
    name: 'generateAdImageFlow',
    inputSchema: GenerateAdImageInputSchema,
    outputSchema: GenerateAdImageOutputSchema,
  },
  async (prompt) => {
    try {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `A professional, photorealistic advertisement image. The image should be: ${prompt}`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        return { imageUrl: media?.url ?? null };
    } catch (e) {
        console.error('Image generation failed', e);
        return { imageUrl: null };
    }
  }
);
