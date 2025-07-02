'use server';
/**
 * @fileOverview AI agent for generating ad visuals.
 *
 * - generateAdVisual - A function that handles the ad visual generation process.
 * - GenerateAdVisualInput - The input type for the generateAdVisual function.
 * - GenerateAdVisualOutput - The return type for the generateAdVisual function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdVisualInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  headline: z.string().describe('The headline of the ad copy.'),
  body: z.string().describe('The body of the ad copy.'),
});
export type GenerateAdVisualInput = z.infer<typeof GenerateAdVisualInputSchema>;

export type GenerateAdVisualOutput = string;

export async function generateAdVisual(input: GenerateAdVisualInput): Promise<GenerateAdVisualOutput> {
  return generateAdVisualFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdVisualPrompt',
  input: {schema: GenerateAdVisualInputSchema},
  prompt: `You are a world-class advertising creative director. Your task is to generate a compelling, photorealistic ad visual based on the provided product information and ad copy. The image should look like a professional advertisement. Do not include any text in the image.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}
Ad Headline: {{{headline}}}
Ad Body: {{{body}}}`,
});

const generateAdVisualFlow = ai.defineFlow(
  {
    name: 'generateAdVisualFlow',
    inputSchema: GenerateAdVisualInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: prompt.renderText(input),
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed to produce an output.');
    }
    
    return media.url;
  }
);
