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
  title: z.string().describe('The title or headline of the ad.'),
  description: z.string().describe('The text content or body of the ad.'),
  platform: z.string().describe('The platform where the ad was seen (e.g., Facebook, TikTok).'),
  likes: z.number().describe('The number of likes on the ad.'),
  comments: z.number().describe('The number of comments on the ad.'),
  shares: z.number().describe('The number of shares of the ad.'),
  score: z.number().min(0).max(100).describe('An AI-generated engagement score from 0-100.'),
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
    targetAudience: z.string().describe("A brief description of the most likely target audience for this product category."),
    competitionLevel: z.enum(['Low', 'Medium', 'High']).describe("An estimation of the competition level for this category based on the ad data."),
    marketingAngles: z.array(z.string()).describe("A list of 2-3 powerful marketing angles to use for this category."),
    exampleProducts: z.array(z.string()).describe("A list of 2-3 product titles from the input ads that exemplify this category.")
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
  prompt: `You are a master e-commerce strategist and data scientist. You have been given a list of recently tracked ads with their performance scores and descriptions. Your task is to analyze this data to identify "winning" product categories and the underlying trends driving their success.

**You must generate your response in the following language: {{{locale}}}.**

**Ad Data Details:**
{{#each ads}}
Ad #{{@index}}:
- **Title:** "{{title}}"
- **Platform:** {{platform}}
- **Description:** "{{description}}"
- **Engagement Metrics:** Likes: {{likes}}, Comments: {{comments}}, Shares: {{shares}}, AI Score: {{score}}
---
{{/each}}

Analyze the provided ad data, especially the top-performers (high scores, likes, and shares), to identify patterns. Group products into broader categories (e.g., "Smart Home Hub" and "LED Strip Lights" could be in a "Smart Home Tech" category).

Based on your analysis, provide:
1.  **Market Overview:** A 2-3 sentence summary of what's currently working. Are there platforms that are dominating? Are there common themes in the product titles or descriptions?
2.  **Winning Categories:** A list of the top 3-5 product categories. For each category:
    -   Provide a clear **Category Name**.
    -   Write a brief **Analysis** explaining *why* this category seems to be successful, referencing the ad data (e.g., "high share counts on Facebook suggest strong word-of-mouth potential").
    -   Give one piece of **Actionable Advice** for someone wanting to sell in this category.
    -   Calculate and provide the **Average Score**, which is the mathematical average of the scores of all ads you've grouped into this category. Round it to the nearest integer.
    -   Describe the likely **Target Audience** for this product category based on the ad descriptions and platforms.
    -   Estimate the **Competition Level** (Low, Medium, or High) based on the variety and performance of ads.
    -   Suggest 2-3 powerful **Marketing Angles** based on the ad descriptions.
    -   List 2-3 **Example Products** by title from the provided data that fit into this category.

Focus your analysis exclusively on the data provided. Do not use external knowledge. Your response must be in valid JSON format and in the requested language ({{{locale}}}).
`,
});

const findWinningProductsFlow = ai.defineFlow(
  {
    name: 'findWinningProductsFlow',
    inputSchema: FindWinningProductsInputSchema,
    outputSchema: FindWinningProductsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('The AI failed to generate a valid winning products analysis.');
      }
      return output;
    } catch (e) {
      console.error('Error within findWinningProductsFlow:', e);
      // Re-throw a standardized error to ensure it's handled correctly upstream.
      throw new Error(`The AI analysis process failed unexpectedly. Reason: ${e instanceof Error ? e.message : 'Unknown'}`);
    }
  }
);
