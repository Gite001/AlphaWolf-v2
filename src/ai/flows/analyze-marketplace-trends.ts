'use server';

/**
 * @fileOverview AI agent for analyzing trends on specific e-commerce marketplaces.
 *
 * - analyzeMarketplaceTrends - A function that handles the marketplace trend analysis.
 * - AnalyzeMarketplaceTrendsInput - The input type for the function.
 * - AnalyzeMarketplaceTrendsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { supportedMarketplaces } from '@/lib/types';

const AnalyzeMarketplaceTrendsInputSchema = z.object({
  marketplace: z.enum(supportedMarketplaces).describe('The e-commerce marketplace to analyze.'),
  productCategory: z.string().describe('The product category to analyze within the marketplace.'),
  region: z.string().describe('The geographical region for the analysis (e.g., USA, Europe).'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type AnalyzeMarketplaceTrendsInput = z.infer<typeof AnalyzeMarketplaceTrendsInputSchema>;

const TrendingProductSchema = z.object({
    name: z.string().describe('The name of the trending product or product type.'),
    description: z.string().describe('A brief description of why this product is trending on this specific marketplace.'),
    marketingAngle: z.string().describe('A specific marketing angle suitable for this product on this platform.')
});

const DemandTrendPointSchema = z.object({
    month: z.string().describe('The month for the data point (e.g., "Jan", "Feb").'),
    demandScore: z.number().min(0).max(100).describe('An estimated demand score from 0-100 for that month, where 100 is peak demand.'),
});

const AnalyzeMarketplaceTrendsOutputSchema = z.object({
  marketplaceSummary: z.string().describe('An overall summary of the current trends for this category on the specified marketplace.'),
  trendingProducts: z.array(TrendingProductSchema).describe('An array of 3-5 trending products or product types.'),
  platformSpecificAdvice: z.string().describe('Actionable advice for sellers specific to the culture and audience of this platform.'),
  commonPitfalls: z.string().describe('Potential risks or common mistakes to avoid when selling this type of product on this platform.'),
  demandTrend: z.array(DemandTrendPointSchema).describe('An array of the last 6 months of estimated demand data for this product category on the platform. This should be a synthesized trend, not real data.'),
  trendAnalysis: z.string().describe("A brief analysis explaining the estimated demand trend shown in the chart.")
});
export type AnalyzeMarketplaceTrendsOutput = z.infer<typeof AnalyzeMarketplaceTrendsOutputSchema>;

export async function analyzeMarketplaceTrends(
  input: AnalyzeMarketplaceTrendsInput
): Promise<AnalyzeMarketplaceTrendsOutput> {
  return analyzeMarketplaceTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketplaceTrendsPrompt',
  input: {schema: AnalyzeMarketplaceTrendsInputSchema},
  output: {schema: AnalyzeMarketplaceTrendsOutputSchema},
  prompt: `You are a world-class e-commerce intelligence analyst who is an expert on trends on specific marketplaces like Aliexpress and Etsy. Your task is to analyze the current market for a given product category on a specific platform.

**Your response must be in the following language: {{{locale}}}.**

Marketplace: {{{marketplace}}}
Product Category: {{{productCategory}}}
Region: {{{region}}}

Based on your vast knowledge of online commerce, social media buzz, and product listing patterns, provide a detailed analysis. Do not pretend to have real-time access. Instead, synthesize your knowledge to provide expert deductions.

Your analysis must include:
1.  **Marketplace Summary:** A brief overview of what's currently popular for this product category on {{{marketplace}}}.
2.  **Trending Products:** Identify 3-5 specific product examples or types that are currently trending. For each:
    - Provide a name.
    - Explain why it's popular on {{{marketplace}}}.
    - Suggest a specific marketing angle tailored to the platform's audience.
3.  **Platform-Specific Advice:** Give actionable advice for selling in this category on {{{marketplace}}}. What do buyers on this platform look for? (e.g., for Etsy: handmade feel, personalization; for Aliexpress: value, novelty, tech gadgets).
4.  **Common Pitfalls:** Point out potential risks or common mistakes sellers make on this platform (e.g., for Etsy: appearing too corporate; for Aliexpress: quality concerns, long shipping times).
5.  **Estimated Demand Trend:** Provide a synthesized trend of consumer demand for this category over the last 6 months. Create an array of 6 data points, one for each month (using short, 3-letter month names), with a 'month' and a 'demandScore' (0-100). This is an educated guess based on seasonal patterns and general market knowledge.
6.  **Trend Analysis:** Briefly explain the reasoning behind the demand trend you generated in 1-2 sentences.

Structure your response according to the output schema. Your response must be in valid JSON format and in the requested language ({{{locale}}}).
`,
});

const analyzeMarketplaceTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeMarketplaceTrendsFlow',
    inputSchema: AnalyzeMarketplaceTrendsInputSchema,
    outputSchema: AnalyzeMarketplaceTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a valid marketplace trends analysis.');
    }
    return output;
  }
);
