'use server';

/**
 * @fileOverview AI agent for analyzing a competitor's ad or product page from a URL.
 *
 * - analyzeCompetitorAd - A function that handles the competitor analysis process.
 * - AnalyzeCompetitorAdInput - The input type for the analyzeCompetitorAd function.
 * - AnalyzeCompetitorAdOutput - The return type for the analyzeCompetitorAd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCompetitorAdInputSchema = z.object({
  url: z.string().url().describe('The URL of the competitor’s product page or ad.'),
});
export type AnalyzeCompetitorAdInput = z.infer<typeof AnalyzeCompetitorAdInputSchema>;

const AnalyzeCompetitorAdOutputSchema = z.object({
  productName: z.string().describe("The likely name of the product being advertised."),
  targetAudience: z.string().describe("An analysis of the likely target audience."),
  marketingAngle: z.string().describe("A summary of the primary marketing angle or value proposition being used."),
  estimatedPerformance: z.object({
      score: z.number().min(0).max(100).describe("An estimated performance score from 0 to 100, where 100 is a top-performing ad or page."),
      reasoning: z.string().describe("A brief explanation for the estimated performance score, based on the page content and marketing angle.")
  }).describe("An estimation of the ad's or page's likely performance."),
  strengths: z.array(z.string()).describe("A list of key strengths in their marketing approach."),
  weaknesses: z.array(z.string()).describe("A list of potential weaknesses or missed opportunities."),
  counterStrategies: z.array(z.string()).describe("A list of actionable counter-strategies or ways to differentiate."),
});
export type AnalyzeCompetitorAdOutput = z.infer<typeof AnalyzeCompetitorAdOutputSchema>;

export async function analyzeCompetitorAd(
  input: AnalyzeCompetitorAdInput
): Promise<AnalyzeCompetitorAdOutput> {
  return analyzeCompetitorAdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCompetitorAdPrompt',
  input: {schema: AnalyzeCompetitorAdInputSchema},
  output: {schema: AnalyzeCompetitorAdOutputSchema},
  prompt: `You are a world-class marketing intelligence analyst and competitor research expert. Your task is to analyze the provided URL and deconstruct the marketing strategy behind it.

**Target URL:** {{{url}}}

Act as if you have fully crawled and analyzed the content of this page. Based on the URL and your vast knowledge of e-commerce, advertising, and marketing:

1.  **Identify the Product:** Determine the likely product name.
2.  **Define the Target Audience:** Who are they trying to reach? Describe their demographics, interests, and pain points.
3.  **Uncover the Marketing Angle:** What is the core message? Are they competing on price, quality, innovation, lifestyle, or something else?
4.  **Pinpoint Strengths:** What are they doing exceptionally well in their messaging, visuals, or offer?
5.  **Find Weaknesses:** Where are the gaps? What are they failing to address? Are there any missed opportunities?
6.  **Propose Counter-Strategies:** Based on their strategy, suggest concrete and actionable ways a competitor could differentiate themselves and win market share.
7.  **Estimate Performance:** Based on all available information, provide an estimated performance score from 0 to 100, and a brief reasoning for that score. This score should reflect its potential to convert and engage its target audience.

Provide a comprehensive analysis structured according to the output schema.

{{output descriptions=true}}
`,
});

const analyzeCompetitorAdFlow = ai.defineFlow(
  {
    name: 'analyzeCompetitorAdFlow',
    inputSchema: AnalyzeCompetitorAdInputSchema,
    outputSchema: AnalyzeCompetitorAdOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
