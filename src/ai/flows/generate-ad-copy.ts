'use server';
/**
 * @fileOverview AI agent for generating ad copy.
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
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const AdCopyVariationSchema = z.object({
    headline: z.string().describe('A catchy headline for the ad.'),
    body: z.string().describe('The main body text of the ad.'),
    cta: z.string().describe('A compelling call to action.'),
});

const GenerateAdCopyOutputSchema = z.object({
  variations: z.array(AdCopyVariationSchema).describe('An array of 3-5 ad copy variations.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;


export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdCopyPrompt',
  input: {schema: GenerateAdCopyInputSchema},
  output: {schema: GenerateAdCopyOutputSchema},
  prompt: `You are an expert copywriter specializing in high-converting ads for e-commerce. Generate 3-5 compelling ad copy variations based on the following product information.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}
Target Audience: {{{targetAudience}}}
Keywords to include: {{{keywords}}}

For each variation, provide a catchy headline, a persuasive body, and a strong call to action (CTA). The tone should be engaging and tailored to the specified target audience. Ensure the keywords are naturally integrated.

{{output descriptions=true}}
`,
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
