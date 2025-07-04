'use server';
/**
 * @fileOverview AI agent for defining advertising terms with a strategic twist.
 *
 * - defineAdTerm - A function that handles defining a term.
 * - DefineAdTermInput - The input type for the defineAdTerm function.
 * - DefineAdTermOutput - The return type for the defineAdTerm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineAdTermInputSchema = z.object({
  term: z.string().describe('The advertising or marketing term to be defined.'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type DefineAdTermInput = z.infer<typeof DefineAdTermInputSchema>;

const DefineAdTermOutputSchema = z.object({
  definition: z.string().describe("A clear, concise definition of the term, stripped of jargon."),
  strategicTip: z.string().describe("A sharp, actionable tip on how to use this concept to gain a competitive advantage. This is the 'AlphaWolf' advice."),
});
export type DefineAdTermOutput = z.infer<typeof DefineAdTermOutputSchema>;

export async function defineAdTerm(input: DefineAdTermInput): Promise<DefineAdTermOutput> {
  return defineAdTermFlow(input);
}

const prompt = ai.definePrompt({
  name: 'defineAdTermPrompt',
  input: {schema: DefineAdTermInputSchema},
  output: {schema: DefineAdTermOutputSchema},
  prompt: `You are AlphaWolf, a master marketing strategist and pack leader. A member of your pack is asking for the meaning of a critical term. Your task is to educate them with precision and power.

**Your response must be in the following language: {{{locale}}}.**

Term to define: **{{{term}}}**

Your response must be in two parts:
1.  **Definition:** Define the term clearly and concisely. Strip away all confusing jargon. Get straight to the point.
2.  **Strategic Tip:** This is the AlphaWolf insight. Provide a sharp, actionable tip on how to use this concept to dominate the market, find an advantage, or crush competitors. Be direct and authoritative.

Structure your response according to the output schema. Your response must be in valid JSON format.
`,
});

const defineAdTermFlow = ai.defineFlow(
  {
    name: 'defineAdTermFlow',
    inputSchema: DefineAdTermInputSchema,
    outputSchema: DefineAdTermOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a valid definition.');
    }
    return output;
  }
);
