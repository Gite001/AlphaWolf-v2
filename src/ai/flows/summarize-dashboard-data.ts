'use server';

/**
 * @fileOverview AI agent for summarizing dashboard data.
 *
 * - summarizeDashboardData - A function that provides a high-level summary and insights from dashboard data.
 * - SummarizeDashboardDataInput - The input type for the summarizeDashboardData function.
 * - SummarizeDashboardDataOutput - The return type for the summarizeDashboardData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StatSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string(),
  changeType: z.enum(['increase', 'decrease']),
});

const EngagementDataSchema = z.object({
  date: z.string(),
  Facebook: z.number(),
  Instagram: z.number(),
  TikTok: z.number(),
  Pinterest: z.number(),
});

const SummarizeDashboardDataInputSchema = z.object({
  stats: z.array(StatSchema).describe('An array of key statistic objects.'),
  engagementData: z
    .array(EngagementDataSchema)
    .describe('An array of objects representing weekly engagement data across platforms.'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type SummarizeDashboardDataInput = z.infer<typeof SummarizeDashboardDataInputSchema>;

const SummarizeDashboardDataOutputSchema = z.object({
  summary: z
    .string()
    .describe('A 2-3 sentence overview of the overall performance.'),
  insights: z
    .array(z.string())
    .describe('A list of 2-3 specific, actionable insights or recommendations.'),
});
export type SummarizeDashboardDataOutput = z.infer<typeof SummarizeDashboardDataOutputSchema>;

export async function summarizeDashboardData(
  input: SummarizeDashboardDataInput
): Promise<SummarizeDashboardDataOutput> {
  return summarizeDashboardDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDashboardDataPrompt',
  input: {schema: SummarizeDashboardDataInputSchema},
  output: {schema: SummarizeDashboardDataOutputSchema},
  prompt: `You are a senior marketing strategist analyzing a performance dashboard for an e-commerce business. Your goal is to provide a high-level summary and actionable insights for the user. Be concise, insightful, and encouraging.

**Your response must be in the following language: {{{locale}}}.**

**Dashboard Data:**

**Key Stats:**
{{#each stats}}
- {{title}}: {{value}} ({{change}})
{{/each}}

**Weekly Engagement (total interactions):**
{{#each engagementData}}
- {{date}}: Facebook: {{Facebook}}, Instagram: {{Instagram}}, TikTok: {{TikTok}}, Pinterest: {{Pinterest}}
{{/each}}

Based on this data, provide:
1.  A concise **summary** (2-3 sentences) of the overall performance. What is the big picture?
2.  A list of 2-3 **actionable insights**. These should be specific, practical recommendations the user can act on. For example, "Double down on TikTok as it's showing the highest growth" or "The 'Smart Home' category is outperforming others, consider a new ad for this niche."

Your response must be in valid JSON format and in the requested language ({{{locale}}}).
`,
});

const summarizeDashboardDataFlow = ai.defineFlow(
  {
    name: 'summarizeDashboardDataFlow',
    inputSchema: SummarizeDashboardDataInputSchema,
    outputSchema: SummarizeDashboardDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
