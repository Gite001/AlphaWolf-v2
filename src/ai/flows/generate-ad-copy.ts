'use server';
/**
 * @fileOverview AI agent for generating ad copy and a matching visual.
 *
 * - generateAdCopy - A function that handles the ad copy and visual generation process.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateAudioAd } from './generate-audio-ad';

const GenerateAdCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  targetAudience: z.string().describe('The target audience for the ad.'),
  keywords: z.string().describe('Comma-separated keywords to include.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const AdCopyVariationSchema = z.object({
    headline: z.string().describe('A catchy headline for the ad.'),
    body: z.string().describe('The main body text of the ad.'),
    cta: z.string().describe('A compelling call to action.'),
    visualPrompt: z.string().describe('A detailed, descriptive prompt for an AI image generation model to create a matching visual. This prompt should be for a photorealistic ad, without any text in the image.'),
});

const GenerateAdCopyOutputSchema = z.object({
  variations: z.array(z.object({
    headline: z.string(),
    body: z.string(),
    cta: z.string(),
    imageUrl: z.string().nullable().describe('The data URI of the generated ad visual. Null if generation failed.'),
    audioUrl: z.string().nullable().describe('The data URI of the generated ad audio. Null if generation failed.'),
  })).describe('An array of 3 ad copy variations, each with a generated visual and audio.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;


export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'generateAdCopyTextPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  output: {schema: z.object({ variations: z.array(AdCopyVariationSchema) })},
  prompt: `You are an expert copywriter and creative director specializing in high-converting ads for e-commerce. Generate 3 compelling ad copy variations based on the following product information.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}
Target Audience: {{{targetAudience}}}
Keywords to include: {{{keywords}}}

For each variation, provide:
1. A catchy headline.
2. A persuasive body text.
3. A strong call to action (CTA).
4. A detailed, photorealistic 'visualPrompt' for an image generation AI to create a matching ad visual. Do not include any text in the visual description.

The tone should be engaging and tailored to the specified target audience. Ensure the keywords are naturally integrated.

{{output descriptions=true}}
`,
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async (input) => {
    // 1. Generate text variations and visual prompts
    const { output: textOutput } = await textGenerationPrompt(input);
    
    if (!textOutput?.variations) {
        throw new Error('Could not generate ad copy variations.');
    }

    // 2. Generate images and audio in parallel for each variation
    const variationsWithMedia = await Promise.all(
        textOutput.variations.map(async (variation) => {
            const [imageResult, audioResult] = await Promise.allSettled([
                ai.generate({
                    model: 'googleai/gemini-2.0-flash-preview-image-generation',
                    prompt: `A professional, photorealistic advertisement image for a product. The ad aesthetic is: ${variation.visualPrompt}`,
                    config: {
                        responseModalities: ['TEXT', 'IMAGE'],
                    },
                }),
                generateAudioAd(variation.body),
            ]);

            const imageUrl = imageResult.status === 'fulfilled' ? imageResult.value.media?.url ?? null : null;
            if (imageResult.status === 'rejected') {
                console.error(`Image generation failed for headline "${variation.headline}":`, imageResult.reason);
            }

            const audioUrl = audioResult.status === 'fulfilled' ? audioResult.value.audioUrl : null;
            if (audioResult.status === 'rejected') {
                console.error(`Audio generation failed for headline "${variation.headline}":`, audioResult.reason);
            }

            return {
                headline: variation.headline,
                body: variation.body,
                cta: variation.cta,
                imageUrl,
                audioUrl,
            };
        })
    );

    return { variations: variationsWithMedia };
  }
);
