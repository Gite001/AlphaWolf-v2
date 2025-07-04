'use server';

/**
 * @fileOverview AI agent for generating a high-level marketing plan for new entrepreneurs.
 *
 * - generateMarketingPlan - Generates a strategic roadmap for a product.
 * - GenerateMarketingPlanInput - The input type for the generateMarketingPlan function.
 * - GenerateMarketingPlanOutput - The return type for the generateMarketingPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const budgetLevels = ['Low', 'Medium', 'High'] as const;
export const marketingGoals = ['Brand Awareness', 'Direct Sales', 'Lead Generation'] as const;

const GenerateMarketingPlanInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A brief description of the product.'),
  targetAudience: z.string().describe('The target audience for the product.'),
  budgetLevel: z.enum(budgetLevels).describe('The approximate budget level for marketing.'),
  marketingGoal: z.enum(marketingGoals).describe('The primary goal of the marketing campaign.'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type GenerateMarketingPlanInput = z.infer<typeof GenerateMarketingPlanInputSchema>;

const PhasedRoadmapStepSchema = z.object({
    phaseName: z.string().describe("The name of the roadmap phase (e.g., 'Phase 1: Launch & Learn')."),
    duration: z.string().describe("The estimated duration for this phase (e.g., 'First Month')."),
    focus: z.string().describe("The primary strategic focus for this phase."),
    actions: z.array(z.string()).describe("A list of concrete actions to take during this phase."),
});

const GenerateMarketingPlanOutputSchema = z.object({
  audienceInsight: z.string().describe("A deeper analysis of the target audience, including potential sub-niches and where to find them online."),
  platformStrategy: z.string().describe("Strategic advice on choosing between building a proprietary website versus using an existing marketplace, without naming specific brands. Discuss the pros and cons of each approach for this specific product."),
  keyMessaging: z.array(z.string()).describe("A list of 3-4 core marketing messages or value propositions to emphasize in all communications."),
  influencerStrategy: z.string().describe("Guidance on the type of influencers to collaborate with (e.g., micro-influencers in a specific niche), what kind of collaboration to propose, and how to measure success."),
  phasedRoadmap: z.array(PhasedRoadmapStepSchema).describe("A 3-phase roadmap (e.g., Launch, Optimize, Scale) with a focus and actionable steps for each phase."),
});
export type GenerateMarketingPlanOutput = z.infer<typeof GenerateMarketingPlanOutputSchema>;

export async function generateMarketingPlan(
  input: GenerateMarketingPlanInput
): Promise<GenerateMarketingPlanOutput> {
  return generateMarketingPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingPlanPrompt',
  input: {schema: GenerateMarketingPlanInputSchema},
  output: {schema: GenerateMarketingPlanOutputSchema},
  prompt: `You are a world-class marketing strategist and a mentor for new entrepreneurs. Your task is to create a clear, actionable marketing roadmap for a new product, breaking down the complex world of online marketing into a simple, step-by-step guide. You must avoid marketing jargon and provide concrete, practical advice.

**Your response must be in the following language: {{{locale}}}.**

**DO NOT mention specific company or brand names** (e.g., Shopify, Amazon, Instagram, TikTok). Instead, talk about the *types* of platforms (e.g., "your own e-commerce site", "major online marketplaces", "short-form video platforms", "image-focused social networks").

**Product & Goal Information:**
- Product Name: {{{productName}}}
- Description: {{{productDescription}}}
- Target Audience: {{{targetAudience}}}
- Budget: {{{budgetLevel}}}
- Primary Goal: {{{marketingGoal}}}

**Your Strategic Plan:**
Based on the information provided, generate the following sections:

1.  **Audience Insight:** Go deeper than the provided audience description. Who are these people really? What are their online habits? What are their pain points that this product solves?
2.  **Platform Strategy:** Advise the user on the classic dilemma: build their own online store vs. selling on a large, existing marketplace. What are the pros and cons for *this specific product and budget*? Guide them to a logical choice.
3.  **Key Messaging:** What are the 3-4 most powerful messages they need to repeat everywhere? Focus on benefits over features.
4.  **Influencer Strategy:** What *type* of influencers should they work with (e.g., micro-influencers in a niche vs. larger lifestyle creators)? What kind of partnership makes sense for their budget (e.g., product gifting vs. paid posts)? How can they tell if it's working?
5.  **Phased Roadmap:** Create a simple 3-phase plan. For each phase, provide a name, a duration, a primary focus, and a list of clear, actionable steps.
    -   Phase 1 should be about launching, testing, and learning.
    -   Phase 2 should be about optimizing based on data.
    -   Phase 3 should be about scaling up what works.

Your response must be in valid JSON format and in the requested language ({{{locale}}}).
`,
});

const generateMarketingPlanFlow = ai.defineFlow(
  {
    name: 'generateMarketingPlanFlow',
    inputSchema: GenerateMarketingPlanInputSchema,
    outputSchema: GenerateMarketingPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
