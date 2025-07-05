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
  prompt: `You are an expert e-commerce intelligence analyst. Your mission is to provide a factual, data-driven report on a product category within a specific online marketplace. Synthesize your knowledge from public data, trend reports, and observed listing patterns. **Avoid generic advice and repetitive phrasing.** Your analysis must be objective. Do not invent information or act as a creative writer.

**Your response must be in the following language: {{{locale}}}.**

**Analysis Request:**
- Marketplace: {{{marketplace}}}
- Product Category: {{{productCategory}}}
- Region: {{{region}}}

**Report Requirements:**
1.  **Marketplace Summary:** A concise, data-centric overview of the category's current state on {{{marketplace}}}.
2.  **Trending Products:** Identify 3-5 trending product types. For each:
    - **Name:** The product's name.
    - **Description:** A factual explanation of its popularity on this platform, based on observed consumer behavior.
    - **Marketing Angle:** A proven marketing angle for this specific platform.
3.  **Platform-Specific Advice:** Provide concrete, actionable advice for sellers based on the platform's known user base and algorithm.
4.  **Common Pitfalls:** List specific, common mistakes sellers make in this category on this platform.
5.  **Estimated Demand Trend:** Synthesize a demand trend for the last 6 months (demandScore 0-100). This must be based on known seasonal patterns and market signals from your training data, not random guessing.
6.  **Trend Analysis:** A brief, data-based explanation for the estimated trend.

**Crucial Directive:** Generate your report based solely on synthesized data and analysis. Your response must be in valid JSON format and in the requested language ({{{locale}}}).
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
