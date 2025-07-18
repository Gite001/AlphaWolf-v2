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
import { getJson } from 'serpapi';

const searchWebForRecentTrends = ai.defineTool(
  {
    name: 'searchWebForRecentTrends',
    description: 'Searches the web for the very latest articles, news, and consumer discussions about a product category to get up-to-the-minute information. Use this to supplement your existing knowledge.',
    inputSchema: z.object({
      query: z.string().describe('A concise search query, like "latest trends in home fitness equipment"'),
    }),
    outputSchema: z.string().describe('A summary of the most relevant and recent findings from the web search.'),
  },
  async ({ query }) => {
    if (!process.env.SERPAPI_API_KEY) {
        return "SerpAPI is not configured. Please add SERPAPI_API_KEY to your .env file and restart the server. Cannot perform live web search.";
    }
    
    console.log(`Performing live web search for: ${query}`);
    try {
        const response: any = await getJson({
            api_key: process.env.SERPAPI_API_KEY,
            engine: "google",
            q: query,
        });

        const organicResults = response.organic_results?.slice(0, 5) || [];
        
        if (organicResults.length === 0) {
            return "No recent web search results found.";
        }

        const summaries = organicResults.map((result: any) => `Title: ${result.title}\nSnippet: ${result.snippet}\nSource: ${result.link}`).join('\n\n---\n\n');

        return `Summary of Top 5 Real-Time Web Search Results for "${query}":\n\n${summaries}`;
    } catch (error) {
        console.error("SerpAPI search failed:", error);
        return "Web search failed due to an external error.";
    }
  }
);


const AnalyzeMarketTrendsInputSchema = z.object({
  productCategory: z.string().describe('The product category to analyze.'),
  region: z.string().describe('The geographical region for the analysis (e.g., USA, Western Europe, Gulf Region).'),
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

const NicheOpportunitySchema = z.object({
    name: z.string().describe('The name of the identified niche market.'),
    description: z.string().describe('A description of the niche and why it represents an opportunity.'),
    targetAudience: z.string().describe('A detailed profile of the specific audience within this niche.'),
    potentialScore: z.number().min(0).max(100).describe('A score from 0-100 representing the growth potential of this niche.'),
});

const GeoTrendPointSchema = z.object({
    country: z.string().describe('The name of the country.'),
    demandScore: z.number().min(0).max(100).describe('An estimated demand score from 0-100 for that country, where 100 is peak demand.'),
});

const AnalyzeMarketTrendsOutputSchema = z.object({
  marketSummary: z.string().describe('An overall summary of the market landscape for this category.'),
  trendingProducts: z.array(TrendingProductSchema).describe('An array of 3-5 trending products in the category.'),
  nicheOpportunities: z.array(NicheOpportunitySchema).describe('An array of 2-3 high-potential, underserved niche markets within the main category.'),
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
  tools: [searchWebForRecentTrends],
  input: {schema: AnalyzeMarketTrendsInputSchema},
  output: {schema: AnalyzeMarketTrendsOutputSchema},
  prompt: `You are a senior e-commerce market intelligence analyst. Your task is to synthesize your vast knowledge of public market data, consumer trend reports, and social media analytics into a concise, data-driven report. **Avoid generic statements, marketing fluff, and repetitive content.** Your analysis must be objective and based on facts and observed patterns from your training data.

**Your response must be in the following language: {{{locale}}}.**

**CRITICAL INSTRUCTION:** Before compiling your final report, you **MUST** use the \`searchWebForRecentTrends\` tool to find the absolute latest, up-to-the-minute information about the requested product category. Integrate these fresh findings from your web search directly into your Market Summary and Opportunities sections to provide the most current intelligence possible.

**Analysis Request:**
- Product Category: {{{productCategory}}}
- Region: {{{region}}}

**Report Requirements:**
1.  **Market Summary:** A brief, data-centric overview of the market, **updated with your real-time web search findings.**
2.  **Trending Products:** Identify 3-5 specific, trending products. For each:
    *   **Name:** The product trend's name.
    *   **Description:** A factual description of why it's trending, referencing consumer behavior shifts or market signals.
    *   **Target Audience:** A precise demographic and psychographic profile.
    *   **Marketing Angle:** A proven, effective marketing angle.
    *   **Competition Level:** (Low, Medium, High) based on market saturation signals.
    *   **Example Product Ideas:** 2-3 concrete product variations.
3.  **Niche Opportunities**: Identify 2-3 high-potential, underserved niche markets within the main category. For each niche, provide its name, a description of the opportunity, a detailed target audience profile, and a potential score from 0-100.
4.  **Opportunities:** Highlight specific, quantifiable opportunities (e.g., underserved niches, new tech adoption), **especially those identified in your web search.**
5.  **Risks:** Identify concrete risks (e.g., supply chain issues, changing regulations, market saturation).
6.  **Geographic Hotspots:** Identify the top 5-7 countries in the region with the highest demand. Provide an estimated demand score (0-100) based on synthesized market size and consumer behavior data.
7.  **Hotspot Analysis:** Briefly explain the data points supporting the geographic distribution.

**Crucial Directive:** Do not invent information. Stick to synthesizing and analyzing patterns from your knowledge base and your fresh web search results. Structure the response according to the output schema. Your response must be in valid JSON and in the requested language ({{{locale}}}).
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
