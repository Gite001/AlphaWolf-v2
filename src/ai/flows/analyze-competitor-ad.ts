'use server';

/**
 * @fileOverview AI agent for analyzing a competitor's ad or product page from a URL or manually provided content.
 *
 * - analyzeCompetitorAd - A function that handles the competitor analysis process.
 * - AnalyzeCompetitorAdInput - The input type for the analyzeCompetitorAd function.
 * - AnalyzeCompetitorAdOutput - The return type for the analyzeCompetitorAd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Fetches the HTML content of a given URL.
 * @param url The URL to fetch.
 * @returns The HTML content of the page body.
 */
async function fetchUrlContent(url: string): Promise<string> {
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
        if (!response.ok) {
            throw new Error(`Could not fetch URL. Status code: ${response.status}`);
        }
        const html = await response.text();

        // Check for client-side rendered apps (SPAs) which may not have content in initial HTML
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';

        // If the body is very small and contains a typical SPA root element, it's likely an SPA.
        if (bodyContent.length < 500 && (bodyContent.toLowerCase().includes('id="root"') || bodyContent.toLowerCase().includes('id="app"'))) {
            throw new Error(`This page appears to require JavaScript to display content. The spy tool currently cannot analyze it correctly.`);
        }
        
        return html;
    } catch (error) {
        console.error(`Failed to fetch URL content for ${url}`, error);
        
        if (error instanceof Error) {
            // Pass specific, user-friendly errors through
            if (error.message.includes('Status code:')) {
                 throw new Error(`The competitor's website could not be reached (Status: ${error.message.split(' ').pop()}). It may be blocking analysis tools.`);
            }
            if (error.message.includes('JavaScript to display content')) {
                throw error;
            }
        }
        // Generic fallback error
        throw new Error('Failed to fetch or process the URL. The website may be down or blocking automated requests.');
    }
}

const AnalyzeCompetitorAdInputSchema = z.object({
  url: z.string().url().optional(),
  pageContent: z.string().optional(),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
}).refine(data => data.url || data.pageContent, {
    message: "Either a URL or page content must be provided for analysis.",
});
export type AnalyzeCompetitorAdInput = z.infer<typeof AnalyzeCompetitorAdInputSchema>;

const AnalyzeCompetitorAdOutputSchema = z.object({
  productName: z.string().describe("The likely name of the product being advertised. If not determinable, return an empty string."),
  productFeatures: z.array(z.string()).describe("A comprehensive list of all key product features, benefits, and technical specifications mentioned (e.g., materials, composition, dimensions, weight, care instructions, key capabilities). Extract all available details. If none are found, return an empty array."),
  targetAudience: z.string().describe("An analysis of the likely target audience based on the page's content and tone. If not determinable, return an empty string."),
  marketingAngle: z.string().describe("A summary of the primary marketing angle or value proposition being used. If not determinable, return an empty string."),
  estimatedPerformance: z.object({
      score: z.number().min(0).max(100).describe("An estimated performance score from 0 to 100, where 100 is a top-performing ad or page."),
      reasoning: z.string().describe("A brief explanation for the estimated performance score, based on the page content and marketing angle.")
  }).describe("An estimation of the ad's or page's likely performance."),
  strengths: z.array(z.string()).describe("A list of key strengths in their marketing approach based on the fetched content. If none are found, return an empty array."),
  weaknesses: z.array(z.string()).describe("A list of potential weaknesses or missed opportunities based on the fetched content. If none are found, return an empty array."),
  counterStrategies: z.array(z.string()).describe("A list of actionable counter-strategies or ways to differentiate. If none are found, return an empty array."),
});
export type AnalyzeCompetitorAdOutput = z.infer<typeof AnalyzeCompetitorAdOutputSchema>;

export async function analyzeCompetitorAd(
  input: AnalyzeCompetitorAdInput
): Promise<AnalyzeCompetitorAdOutput> {
  return analyzeCompetitorAdFlow(input);
}


// This new input schema is for the prompt that does the analysis.
const CompetitorAnalysisPromptInputSchema = z.object({
    pageContent: z.string().describe('The full HTML content of the competitor\'s webpage.'),
    locale: z.enum(['en', 'fr']).optional().default('en'),
});

const analysisPrompt = ai.definePrompt({
  name: 'competitorAnalysisPrompt',
  input: {schema: CompetitorAnalysisPromptInputSchema},
  output: {schema: AnalyzeCompetitorAdOutputSchema},
  prompt: `You are a world-class marketing intelligence analyst and competitor research expert. Your task is to analyze the provided HTML content of a webpage and deconstruct the marketing strategy behind it.

**Your response must be in the following language: {{{locale}}}.**

Based on the **provided HTML content** below, perform a comprehensive analysis.

\`\`\`html
{{{pageContent}}}
\`\`\`

**Crucial Rule for Missing Information:**
-   **Stick to the Facts:** Base your entire analysis ONLY on the HTML content provided. Do not invent information or use external knowledge.
-   **Handle Missing Information:** It is critical that you follow this rule. For any text field (like 'targetAudience' or 'productName'), if you cannot determine the value, you **MUST** return an empty string (""). For any array field (like 'strengths'), you **MUST** return an empty array ([]). **DO NOT** write phrases like "Not available", "Cannot be determined", or "Inconnu".

**Your Analysis Steps:**
1.  **Identify the Product:** Determine the product name from the content.
2.  **Extract All Product Details:** Meticulously list all product details. This includes key features, benefits, and ALL technical specifications like materials, composition, dimensions, weight, care instructions, and other capabilities mentioned in the content. Be exhaustive.
3.  **Define the Target Audience:** Who are they trying to reach? Describe their demographics, interests, and pain points based on the text and marketing angle.
4.  **Uncover the Marketing Angle:** What is the core message? Are they competing on price, quality, innovation, lifestyle, or something else?
5.  **Pinpoint Strengths:** What are they doing exceptionally well in their messaging, visuals (as described in the text), or offer?
6.  **Find Weaknesses:** Where are the gaps? What are they failing to address? Are there any missed opportunities in the provided content?
7.  **Propose Counter-Strategies:** Based on their strategy, suggest concrete and actionable ways a competitor could differentiate themselves and win market share.
8.  **Estimate Performance:** Based on the content, provide an estimated performance score from 0 to 100, and a brief reasoning for that score.

Provide a comprehensive analysis structured according to the output schema. Your response must be in valid JSON format and in the requested language ({{{locale}}}).
`,
});

const analyzeCompetitorAdFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitorAdFlow',
    inputSchema: AnalyzeCompetitorAdInputSchema,
    outputSchema: AnalyzeCompetitorAdOutputSchema,
  },
  async (input) => {
    // Step 1: Determine the page content. Prioritize manually provided content.
    let pageContent: string;
    if (input.pageContent) {
        pageContent = input.pageContent;
    } else if (input.url) {
        pageContent = await fetchUrlContent(input.url);
    } else {
        // This case should be prevented by the schema refinement, but as a safeguard:
        throw new Error('Analysis requires either a URL or page content.');
    }

    // Step 2: Pass the content to the AI for analysis.
    const {output} = await analysisPrompt({
        pageContent,
        locale: input.locale
    });

    if (!output) {
        throw new Error('The AI failed to produce an analysis from the page content.');
    }
    
    return output;
  }
);
