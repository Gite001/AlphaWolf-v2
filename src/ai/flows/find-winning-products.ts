'use server';

/**
 * @fileOverview AI agent for finding winning products by analyzing organic web search results for a given category.
 *
 * - findWinningProducts - Analyzes search data to identify top-performing product categories.
 * - FindWinningProductsInput - The input type for the findWinningProducts function.
 * - FindWinningProductsOutput - The return type for the findWinningProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getJson } from 'serpapi';

const FindWinningProductsInputSchema = z.object({
  query: z.string().describe('The product category to search for, e.g., "sustainable sneakers".'),
  country: z.string().describe('The country code to search in (e.g., us, fr).'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type FindWinningProductsInput = z.infer<typeof FindWinningProductsInputSchema>;

const WinningProductCategorySchema = z.object({
    categoryName: z.string().describe('The name of the winning product category.'),
    analysis: z.string().describe('A brief analysis explaining why this category is performing well, based on the provided search result data.'),
    actionableAdvice: z.string().describe('A concrete piece of advice for a marketer looking to enter this category.'),
    averageScore: z.number().min(0).max(100).describe('An AI-estimated popularity score for this category, from 0 to 100, based on search result prominence and sentiment.'),
    targetAudience: z.string().describe("A brief description of the most likely target audience for this product category."),
    competitionLevel: z.enum(['Low', 'Medium', 'High']).describe("An estimation of the competition level for this category based on the search data."),
    marketingAngles: z.array(z.string()).describe("A list of 2-3 powerful marketing angles to use for this category, derived from the search results."),
    exampleProducts: z.array(z.string()).describe("A list of 2-3 specific product names or types mentioned in the search results that exemplify this category.")
});

const FindWinningProductsOutputSchema = z.object({
  marketOverview: z.string().describe('A high-level summary of the key patterns observed in the top search results for this product category.'),
  winningCategories: z.array(WinningProductCategorySchema).describe('A list of the top 3-5 winning product categories identified from the data.'),
});
export type FindWinningProductsOutput = z.infer<typeof FindWinningProductsOutputSchema>;

export async function findWinningProducts(
  input: FindWinningProductsInput
): Promise<FindWinningProductsOutput> {
  return findWinningProductsFlow(input);
}

const findWinningProductsFlow = ai.defineFlow(
  {
    name: 'findWinningProductsFlow',
    inputSchema: FindWinningProductsInputSchema,
    outputSchema: FindWinningProductsOutputSchema,
  },
  async ({ query, country, locale }) => {
    if (!process.env.SERPAPI_API_KEY) {
        throw new Error("SerpAPI is not configured. Please add SERPAPI_API_KEY to your .env file.");
    }
    
    console.log(`Performing organic product search for: ${query} in ${country}`);

    const searchResults = await getJson({
        api_key: process.env.SERPAPI_API_KEY,
        engine: "google",
        q: `top selling ${query}`,
        gl: country,
        hl: locale,
    });
    
    const organicResults = searchResults.organic_results?.slice(0, 10) || [];

    if (organicResults.length === 0) {
      throw new Error("No organic search results found for this query. The market might be too niche or the query too specific.");
    }

    const analysisInput = {
        productCategory: query,
        searchResults: organicResults.map((res: any) => ({
            title: res.title,
            link: res.link,
            snippet: res.snippet
        })),
        locale,
    };

    const { output } = await analysisPrompt(analysisInput);
    if (!output) {
      throw new Error('The AI failed to generate a valid winning products analysis from search results.');
    }
    return output;
  }
);


const AnalysisPromptInputSchema = z.object({
    productCategory: z.string(),
    searchResults: z.array(z.object({
        title: z.string(),
        link: z.string(),
        snippet: z.string(),
    })),
    locale: z.enum(['en', 'fr']).optional().default('en'),
});


const analysisPrompt = ai.definePrompt({
  name: 'analyzeOrganicProductSearchPrompt',
  input: {schema: AnalysisPromptInputSchema},
  output: {schema: FindWinningProductsOutputSchema},
  prompt: `You are a data scientist and e-commerce strategist. Your task is to perform a rigorous analysis of the provided Google search results for a product category. **Your entire analysis must be derived ONLY from the data below.** Do not use external knowledge or make assumptions. Your goal is to identify which sub-categories and product types are demonstrating strong organic popularity.

**You must generate your response in the following language: {{{locale}}}.**

**Product Category Analyzed:** "{{productCategory}}"

**Top Organic Search Results Data:**
{{#each searchResults}}
Result #{{@index}}:
- **Title:** "{{title}}"
- **Snippet:** "{{snippet}}"
---
{{/each}}

**Analysis Procedure:**
1.  Read through all the titles and snippets to understand the main themes, products, and brands being discussed.
2.  Group the findings into logical product sub-categories based on the search results.
3.  Analyze the language (e.g., "best-selling", "top-rated", "popular") to gauge the popularity and sentiment for each category.

**Report Requirements:**
1.  **Market Overview:** A 2-3 sentence summary of the key patterns observed **in the search data**. What types of products or features are most prominent?
2.  **Winning Categories:** A list of the top 3-5 product sub-categories. For each category:
    -   **Category Name:** The name of the category you identified (e.g., "Minimalist Leather Sneakers", "Waterproof Trail Runners").
    -   **Analysis:** A brief explanation for this category's popularity, **citing evidence from the search snippets** (e.g., "multiple results mention 'all-day comfort' and 'versatile style'").
    -   **Actionable Advice:** One concrete piece of advice for a marketer, **based directly on the data analysis**.
    -   **Average Score:** An estimated popularity score (0-100) you assign based on how strongly and frequently this category appears in the search results.
    -   **Target Audience:** A description of the target audience as inferred **only from the language in the search results**.
    -   **Competition Level:** (Low, Medium, High) estimated based **only on the variety and authority of sites in the search results**.
    -   **Marketing Angles:** 2-3 powerful marketing angles **extracted directly from the provided titles and snippets**.
    -   **Example Products:** 2-3 specific product types or names **mentioned in the search results**.

Your response must be a valid JSON object strictly following the output schema, in the requested language ({{{locale}}}).
`,
});
```