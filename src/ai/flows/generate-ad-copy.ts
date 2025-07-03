'use server';
/**
 * @fileOverview AI agent for generating ad copy and a matching visual.
 *
 * - generateAdCopy - A function that handles the ad copy generation process.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  targetAudience: z.string().describe('The target audience for the ad.'),
  keywords: z.string().describe('Comma-separated keywords to include.'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const AdCopyVariationSchema = z.object({
    headline: z.string().describe('A catchy headline for the ad.'),
    body: z.string().describe('The main body text of the ad.'),
    cta: z.string().describe('A compelling call to action.'),
    visualPrompt: z.string().describe('A detailed, descriptive prompt for an AI image generation model to create a matching visual. This prompt should describe a photorealistic scene for an advertisement, focusing on the product in context. **Do not include any text in the prompt.** The description should be vivid and appealing to the target audience.'),
});

const GenerateAdCopyOutputSchema = z.object({
  variations: z.array(AdCopyVariationSchema).describe('An array of 3 ad copy text variations, each with a visual prompt.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;


export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'generateAdCopyTextPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  output: {schema: GenerateAdCopyOutputSchema},
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

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async (input) => {
    const { output } = await textGenerationPrompt(input);
    
    if (!output?.variations) {
        throw new Error('Could not generate ad copy variations.');
    }

    return { variations: output.variations };
  }
);
