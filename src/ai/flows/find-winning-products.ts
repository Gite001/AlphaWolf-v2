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
  prompt: `You are a data scientist and e-commerce strategist. Your task is to perform a rigorous analysis of the provided advertising data. **Your entire analysis must be derived ONLY from the data below.** Do not use external knowledge or make assumptions. Be objective and concise.

**You must generate your response in the following language: {{{locale}}}.**

**Input Ad Data:**
{{#each ads}}
Ad #{{@index}}:
- **Title:** "{{title}}"
- **Platform:** {{platform}}
- **Description:** "{{description}}"
- **Engagement Metrics:** Likes: {{likes}}, Comments: {{comments}}, Shares: {{shares}}, AI Score: {{score}}
---
{{/each}}

**Analysis Procedure:**
1.  Group the ads into logical product categories based on their titles and descriptions.
2.  Analyze the engagement metrics for each category to identify top performers.

**Report Requirements:**
1.  **Market Overview:** A 2-3 sentence summary of the key patterns observed **in the data**. Which platforms and themes are most successful?
2.  **Winning Categories:** A list of the top 3-5 product categories. For each category:
    -   **Category Name:** The name of the category you identified.
    -   **Analysis:** A brief explanation for this category's success, **citing specific data points** (e.g., "high share counts on Facebook for ads like '...'").
    -   **Actionable Advice:** One concrete piece of advice for a marketer, **based directly on the data analysis**.
    -   **Average Score:** The mathematical average of the scores of all ads in this category, rounded to the nearest integer.
    -   **Target Audience:** A description of the target audience as inferred **only from the ad descriptions and platforms provided**.
    -   **Competition Level:** (Low, Medium, High) estimated based **only on the ad variety and performance in the input data**.
    -   **Marketing Angles:** 2-3 powerful marketing angles **extracted directly from the provided ad descriptions**.
    -   **Example Products:** 2-3 product titles from the input ads that fit this category.

Your response must be a valid JSON object strictly following the output schema, in the requested language ({{{locale}}}).
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
