'use server';
/**
 * @fileOverview AI agent for generating ad copy and all associated media (visuals, audio).
 *
 * - generateAdCopy - A function that handles the ad copy generation process.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const GenerateAdCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  targetAudience: z.string().describe('The target audience for the ad.'),
  keywords: z.string().describe('Comma-separated keywords to include.'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

// This schema is for the TEXT-ONLY generation part.
const AdCopyTextVariationSchema = z.object({
    headline: z.string().describe('A catchy headline for the ad.'),
    body: z.string().describe('The main body text of the ad.'),
    cta: z.string().describe('A compelling call to action.'),
    visualPrompt: z.string().describe('A detailed, descriptive prompt for an AI image generation model to create a matching visual. This prompt should describe a photorealistic scene for an advertisement, focusing on the product in context. **Do not include any text in the prompt.** The description should be vivid and appealing to the target audience.'),
});

// This is the final output schema, including media URLs.
const AdCopyVariationWithMediaSchema = AdCopyTextVariationSchema.extend({
    imageUrl: z.string().nullable().describe("The data URI of the generated ad visual. Null if generation failed."),
    audioUrl: z.string().nullable().describe("The data URI of the generated audio for the ad body. Null if generation failed."),
});

const GenerateAdCopyOutputSchema = z.object({
  variations: z.array(AdCopyVariationWithMediaSchema).describe('An array of 3 ad copy variations, each with a generated visual and audio.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;


export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

// Prompt for just the text part
const textGenerationPrompt = ai.definePrompt({
  name: 'generateAdCopyTextPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  // The output of this specific prompt is just the text variations
  output: {schema: z.object({ variations: z.array(AdCopyTextVariationSchema) })},
  prompt: `You are an expert copywriter and creative director specializing in high-converting ads for e-commerce. Generate 3 compelling ad copy variations based on the following product information.

**The ad copy (headline, body, cta) must be in the following language: {{{locale}}}.**

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}
Target Audience: {{{targetAudience}}}
Keywords to include: {{{keywords}}}

For each variation, provide:
1. A catchy headline.
2. A persuasive body text.
3. A strong call to action (CTA).
4. A detailed, descriptive 'visualPrompt' for an image generation AI to create a matching ad visual. The prompt should describe a photorealistic scene for an advertisement, focusing on the product in context. **Do not include any text in the prompt.** The description should be vivid and appealing to the target audience.

The tone should be engaging and tailored to the specified target audience. Ensure the keywords are naturally integrated. Your response must be in valid JSON format.
`,
});

// Helper function from generate-audio-ad.ts
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async (input) => {
    // 1. Generate the text variations first.
    const { output: textOutput } = await textGenerationPrompt(input);
    
    if (!textOutput?.variations || textOutput.variations.length === 0) {
        throw new Error('Could not generate ad copy variations.');
    }

    // 2. For each variation, generate image and audio in parallel.
    const variationsWithMedia = await Promise.all(
        textOutput.variations.map(async (variation) => {
            const [imageResult, audioResult] = await Promise.allSettled([
                // Image Generation
                ai.generate({
                    model: 'googleai/gemini-2.0-flash-preview-image-generation',
                    prompt: `A professional, photorealistic advertisement image. The image should be: ${variation.visualPrompt}`,
                    config: {
                        responseModalities: ['TEXT', 'IMAGE'],
                    },
                }),
                // Audio Generation
                ai.generate({
                    model: googleAI.model('gemini-2.5-flash-preview-tts'),
                    config: {
                        responseModalities: ['AUDIO'],
                        speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Algenib' },
                        },
                        },
                    },
                    prompt: variation.body,
                }),
            ]);
            
            // Process image result
            let imageUrl: string | null = null;
            if (imageResult.status === 'fulfilled' && imageResult.value.media) {
                imageUrl = imageResult.value.media.url;
            } else {
                 console.error('Image generation failed for a variation:', imageResult.status === 'rejected' ? imageResult.reason : 'No media returned');
            }
            
            // Process audio result
            let audioUrl: string | null = null;
            if (audioResult.status === 'fulfilled' && audioResult.value.media) {
                const media = audioResult.value.media;
                const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
                audioUrl = 'data:audio/wav;base64,' + await toWav(audioBuffer);
            } else {
                console.error('Audio generation failed for a variation:', audioResult.status === 'rejected' ? audioResult.reason : 'No media returned');
            }

            return {
                ...variation,
                imageUrl,
                audioUrl,
            };
        })
    );

    return { variations: variationsWithMedia };
  }
);
