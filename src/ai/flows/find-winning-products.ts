'use server';

/**
 * @fileOverview AI agent for analyzing a list of ads to find winning products and trends.
 *
 * - findWinningProducts - Analyzes ad data to identify top-performing product categories.
 * - FindWinningProductsInput - The input type for the findWinningProducts function.
 * - FindWinningProductsOutput - The return type for the findWinningProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdDataSchema = z.object({
  title: z.string(),
  platform: z.string(),
  score: z.number(),
});

const FindWinningProductsInputSchema = z.object({
  ads: z.array(AdDataSchema).describe('A list of ad data objects, each with a title, platform, and engagement score.'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type FindWinningProductsInput = z.infer<typeof FindWinningProductsInputSchema>;

const WinningProductCategorySchema = z.object({
    categoryName: z.string().describe('The name of the winning product category.'),
    analysis: z.string().describe('A brief analysis explaining why this category is performing well, based on the provided ad data.'),
    actionableAdvice: z.string().describe('A concrete piece of advice for a marketer looking to enter this category.'),
    averageScore: z.number().min(0).max(100).describe('The average performance score of all ads identified within this category, rounded to the nearest integer.'),
});

const FindWinningProductsOutputSchema = z.object({
  marketOverview: z.string().describe('A high-level summary of the key patterns observed in the top-performing ads.'),
  winningCategories: z.array(WinningProductCategorySchema).describe('A list of the top 3-5 winning product categories identified from the data.'),
});
export type FindWinningProductsOutput = z.infer<typeof FindWinningProductsOutputSchema>;

export async function findWinningProducts(
  input: FindWinningProductsInput
): Promise<FindWinningProductsOutput> {
  return findWinningProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findWinningProductsPrompt',
  input: {schema: FindWinningProductsInputSchema},
  output: {schema: FindWinningProductsOutputSchema},
  prompt: `You are a master e-commerce strategist and data scientist. You have been given a list of recently tracked ads with their performance scores. Your task is to analyze this data to identify "winning" product categories and the underlying trends driving their success.

**You must generate your response in the following language: {{{locale}}}.**

**Ad Data:**
{{#each ads}}
- Title: "{{title}}", Platform: {{platform}}, Score: {{score}}
{{/each}}

Analyze the ads, especially the top-performers (high scores), to identify patterns. Group products into broader categories (e.g., "Smart Home Hub" and "LED Strip Lights" could be in a "Smart Home Tech" category).

Based on your analysis, provide:
1.  **Market Overview:** A 2-3 sentence summary of what's currently working. Are there platforms that are dominating? Are there common themes in the product titles?
2.  **Winning Categories:** A list of the top 3-5 product categories. For each category:
    -   Provide a clear **Category Name**.
    -   Write a brief **Analysis** explaining *why* this category seems to be successful, referencing the ad data.
    -   Give one piece of **Actionable Advice** for someone wanting to sell in this category.
    -   Calculate and provide the **Average Score**, which is the mathematical average of the scores of all ads you've grouped into this category. Round it to the nearest integer.

Focus your analysis exclusively on the data provided. Do not use external knowledge. Your response must be in valid JSON format and in the requested language ({{{locale}}}).
`,
});

const findWinningProductsFlow = ai.defineFlow(
  {
    name: 'findWinningProductsFlow',
    inputSchema: FindWinningProductsInputSchema,
    outputSchema: FindWinningProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a valid winning products analysis.');
    }
    return output;
  }
);
