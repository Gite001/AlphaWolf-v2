'use server';

/**
 * @fileOverview AI agent for analyzing the performance of an ad based on its visual and text.
 *
 * - analyzeAdPerformance - A function that handles the ad performance analysis process.
 * - AnalyzeAdPerformanceInput - The input type for the analyzeAdPerformance function.
 * - AnalyzeAdPerformanceOutput - The return type for the analyzeAdPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAdPerformanceInputSchema = z.object({
  adText: z.string().describe('The text of the ad.'),
  adVisualDataUri: z
    .string()
    .describe(
      "A photo of the ad visual, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetAudience: z.string().describe('The target audience of the ad.'),
  productType: z.string().describe('The type of product being advertised.'),
});
export type AnalyzeAdPerformanceInput = z.infer<typeof AnalyzeAdPerformanceInputSchema>;

const AnalyzeAdPerformanceOutputSchema = z.object({
  engagementEstimate: z
    .number()
    .describe(
      'An estimate of the ad engagement rate, on a scale of 0 to 1, where 1 is very high engagement.'
    ),
  predictedPerformance: z
    .string()
    .describe('A description of the predicted performance of the ad.'),
  strengths: z.string().describe('The strengths of the ad.'),
  weaknesses: z.string().describe('The weaknesses of the ad.'),
  suggestions: z.string().describe('Suggestions for improving the ad.'),
});
export type AnalyzeAdPerformanceOutput = z.infer<typeof AnalyzeAdPerformanceOutputSchema>;

export async function analyzeAdPerformance(
  input: AnalyzeAdPerformanceInput
): Promise<AnalyzeAdPerformanceOutput> {
  return analyzeAdPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAdPerformancePrompt',
  input: {schema: AnalyzeAdPerformanceInputSchema},
  output: {schema: AnalyzeAdPerformanceOutputSchema},
  prompt: `You are an expert in advertising analysis. You will analyze the performance of an ad based on its text, visual, target audience, and product type.

Ad Text: {{{adText}}}
Ad Visual: {{media url=adVisualDataUri}}
Target Audience: {{{targetAudience}}}
Product Type: {{{productType}}}

Consider the following aspects when analyzing the ad:
- How well the visual and text complement each other
- The appeal of the ad to the target audience
- The clarity and persuasiveness of the ad message
- The overall quality and professionalism of the ad

Based on your analysis, provide the following:
- An estimate of the ad engagement rate on a scale of 0 to 1.
- A description of the predicted performance of the ad.
- The strengths of the ad.
- The weaknesses of the ad.
- Suggestions for improving the ad.

{{output descriptions=true}}
`,
});

const analyzeAdPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeAdPerformanceFlow',
    inputSchema: AnalyzeAdPerformanceInputSchema,
    outputSchema: AnalyzeAdPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
