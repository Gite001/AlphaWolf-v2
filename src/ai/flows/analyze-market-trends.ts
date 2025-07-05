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
  region: z.string().describe('The geographical region for the analysis (e.g., USA, Western Europe).'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type AnalyzeMarketTrendsInput = z.infer<typeof AnalyzeMarketTrendsInputSchema>;

const TrendingProductSchema = z.object({
    name: z.string().describe('The name of the trending product.'),
    description: z.string().describe('A brief description of why this product is trending.'),
    targetAudience: z.string().describe('The ideal target audience for this product.'),
    marketingAngle: z.string().describe('A powerful marketing angle to sell this product.'),
    competitionLevel: z.enum(['Low', 'Medium', 'High']).describe("An estimation of the competition level for this product idea."),
    exampleProductIdeas: z.array(z.string()).describe("A list of 2-3 specific product ideas or variations within this trend."),
});

const GeoTrendPointSchema = z.object({
    country: z.string().describe('The name of the country.'),
    demandScore: z.number().min(0).max(100).describe('An estimated demand score from 0-100 for that country, where 100 is peak demand.'),
});

const AnalyzeMarketTrendsOutputSchema = z.object({
  marketSummary: z.string().describe('An overall summary of the market landscape for this category.'),
  trendingProducts: z.array(TrendingProductSchema).describe('An array of 3-5 trending products in the category.'),
  opportunities: z.string().describe('Key opportunities for new sellers or products in this market.'),
  risks: z.string().describe('Potential risks or market saturation points to be aware of.'),
  geoTrend: z.array(GeoTrendPointSchema).describe('An array of the top 5-7 countries for this product category, ranked by estimated demand.'),
  geoTrendAnalysis: z.string().describe("A brief analysis explaining the geographic demand distribution.")
});
export type AnalyzeMarketTrendsOutput = z.infer<typeof AnalyzeMarketTrendsOutputSchema>;

export async function analyzeMarketTrends(
  input: AnalyzeMarketTrendsInput
): Promise<AnalyzeMarketTrendsOutput> {
  return analyzeMarketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketTrendsPrompt',
  system: "You are an AI assistant that ONLY responds in valid JSON format as defined by the provided output schema. Do not under any circumstances deviate from this format.",
  input: {schema: AnalyzeMarketTrendsInputSchema},
  output: {schema: AnalyzeMarketTrendsOutputSchema},
  prompt: `You are a senior e-commerce market intelligence analyst. Your task is to synthesize your vast knowledge of public market data, consumer trend reports, and social media analytics into a concise, data-driven report. **Avoid generic statements, marketing fluff, and repetitive content.** Your analysis must be objective and based on facts and observed patterns from your training data.

**Your response must be in the following language: {{{locale}}}.**

**Analysis Request:**
- Product Category: {{{productCategory}}}
- Region: {{{region}}}

**Report Requirements:**
1.  **Market Summary:** A brief, data-centric overview of the market.
2.  **Trending Products:** Identify 3-5 specific, trending products. For each:
    *   **Name:** The product trend's name.
    *   **Description:** A factual description of why it's trending, referencing consumer behavior shifts or market signals.
    *   **Target Audience:** A precise demographic and psychographic profile.
    *   **Marketing Angle:** A proven, effective marketing angle.
    *   **Competition Level:** (Low, Medium, High) based on market saturation signals.
    *   **Example Product Ideas:** 2-3 concrete product variations.
3.  **Opportunities:** Highlight specific, quantifiable opportunities (e.g., underserved niches, new tech adoption).
4.  **Risks:** Identify concrete risks (e.g., supply chain issues, changing regulations, market saturation).
5.  **Geographic Hotspots:** Identify the top 5-7 countries in the region with the highest demand. Provide an estimated demand score (0-100) based on synthesized market size and consumer behavior data.
6.  **Hotspot Analysis:** Briefly explain the data points supporting the geographic distribution.

**Crucial Directive:** Do not invent information. Stick to synthesizing and analyzing patterns from your knowledge base. Structure the response according to the output schema. Your response must be in valid JSON and in the requested language ({{{locale}}}).
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
