'use server';

/**
 * @fileOverview AI agent for analyzing market trends for a product category.
 *
 * - analyzeMarketTrends - A function that handles the market trend analysis process.
 * - AnalyzeMarketTrendsInput - The input type for the analyzeMarketTrends function.
 * - AnalyzeMarketTrendsOutput - The return type for the analyzeMarketTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketTrendsInputSchema = z.object({
  productCategory: z.string().describe('The product category to analyze.'),
  region: z.string().describe('The geographical region for the analysis (e.g., USA, Europe).'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type AnalyzeMarketTrendsInput = z.infer<typeof AnalyzeMarketTrendsInputSchema>;

const TrendingProductSchema = z.object({
    name: z.string().describe('The name of the trending product.'),
    description: z.string().describe('A brief description of why this product is trending.'),
});

const AnalyzeMarketTrendsOutputSchema = z.object({
  marketSummary: z.string().describe('An overall summary of the market landscape for this category.'),
  trendingProducts: z.array(TrendingProductSchema).describe('An array of 3-5 trending products in the category.'),
  opportunities: z.string().describe('Key opportunities for new sellers or products in this market.'),
  risks: z.string().describe('Potential risks or market saturation points to be aware of.'),
});
export type AnalyzeMarketTrendsOutput = z.infer<typeof AnalyzeMarketTrendsOutputSchema>;

export async function analyzeMarketTrends(
  input: AnalyzeMarketTrendsInput
): Promise<AnalyzeMarketTrendsOutput> {
  return analyzeMarketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketTrendsPrompt',
  input: {schema: AnalyzeMarketTrendsInputSchema},
  output: {schema: AnalyzeMarketTrendsOutputSchema},
  prompt: `You are a world-class market research analyst specializing in e-commerce trends. Your task is to analyze the current market for the given product category and region to identify the most sought-after products.

**Your response must be in the following language: {{{locale}}}.**

Product Category: {{{productCategory}}}
Region: {{{region}}}

Based on your knowledge of current consumer behavior, social media trends, and market data, provide a detailed analysis including:
1.  **Market Summary:** A brief overview of the current state of the market for this category.
2.  **Trending Products:** Identify 3-5 specific products that are currently popular or have high growth potential. For each product, provide a name and a short description of why it's trending.
3.  **Opportunities:** Highlight key opportunities for new e-commerce sellers. This could involve underserved niches, new technologies, or marketing angles.
4.  **Risks:** Point out potential risks, such as high competition, market saturation, or changing consumer preferences.

Structure your response according to the output schema. Your response must be in valid JSON format and in the requested language ({{{locale}}}).
`,
});

const analyzeMarketTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeMarketTrendsFlow',
    inputSchema: AnalyzeMarketTrendsInputSchema,
    outputSchema: AnalyzeMarketTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a valid market trends analysis.');
    }
    return output;
  }
);
