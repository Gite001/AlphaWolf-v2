'use server';

/**
 * @fileOverview AI agent for analyzing a competitor's ad or product page from a URL or manually provided content.
 *
 * - analyzeCompetitorAd - A function that handles the competitor analysis process.
 * - AnalyzeCompetitorAdInput - The input type for the analyzeCompetitorAd function.
 * - AnalyzeCompetitorAdOutput - The return type for the analyzeCompetitorAd function.
 */

import {ai} from '@/ai/genkit';
import { fetchUrlContent } from '@/lib/network';
import {z} from 'genkit';

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
  prompt: `You are a marketing intelligence analyst. Your task is to perform a forensic analysis of the provided HTML content from a competitor's webpage. Your entire report must be based **exclusively** on the text and structure of the provided HTML.

**Your response must be in the following language: {{{locale}}}.**

**Source HTML Content:**
\`\`\`html
{{{pageContent}}}
\`\`\`

**Crucial Rules:**
1.  **Data-Driven:** Base your analysis ONLY on the HTML content provided. Do not invent information, infer beyond the text, or use any external knowledge.
2.  **Handle Missing Information:** If a value for a field cannot be determined from the text, you **MUST** return an empty string ("") for text fields or an empty array ([]) for array fields. Do not write "N/A" or "Not found". This is a strict requirement.

**Analysis Steps:**
1.  **Product Identification:** Extract the product name from the content.
2.  **Feature Extraction:** Meticulously list all product features, benefits, and technical specifications (materials, dimensions, etc.) mentioned in the content. Be exhaustive.
3.  **Target Audience Profile:** Describe the target audience based *only* on the language, tone, and features presented in the text.
4.  **Marketing Angle Deconstruction:** Identify the primary marketing angle (e.g., price, quality, innovation) used in the content.
5.  **Strengths & Weaknesses:** List strengths and weaknesses based *only* on the provided content.
6.  **Counter-Strategies:** Suggest actionable counter-strategies based on the identified weaknesses.
7.  **Performance Estimation:** Provide a performance score (0-100) and a brief reasoning based *only* on the marketing elements found in the HTML.

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
