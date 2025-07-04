'use server';
/**
 * @fileOverview AI agent for generating strategic counter-attacks against a competitor's product page.
 *
 * - generateTakedownPlan - The main function to generate a takedown plan.
 * - GenerateTakedownPlanInput - The input type for the function.
 * - GenerateTakedownPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Re-use the fetch function from the spy tool.
async function fetchUrlContent(url: string): Promise<string> {
    try {
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
        if (!response.ok) {
            throw new Error(`Could not fetch URL. Status code: ${response.status}`);
        }
        const html = await response.text();
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1].trim() : '';

        if (bodyContent.length < 500 && (bodyContent.toLowerCase().includes('id="root"') || bodyContent.toLowerCase().includes('id="app"'))) {
            throw new Error(`This page appears to require JavaScript to display content. The tool currently cannot analyze it correctly.`);
        }
        return html;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Status code:')) {
                 throw new Error(`The competitor's website could not be reached (Status: ${error.message.split(' ').pop()}). It may be blocking analysis tools.`);
            }
            if (error.message.includes('JavaScript to display content')) {
                throw new Error("This page requires JavaScript and can't be analyzed. Try a different page.");
            }
        }
        throw new Error('Failed to fetch or process the URL. The website may be down or blocking automated requests.');
    }
}


export const GenerateTakedownPlanInputSchema = z.object({
  url: z.string().url().describe("The URL of the competitor's product page."),
  yourProductName: z.string().describe("The name of your product, which will be used to counter the competitor."),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type GenerateTakedownPlanInput = z.infer<typeof GenerateTakedownPlanInputSchema>;

const TakedownAngleSchema = z.object({
    angleName: z.string().describe("The name of the strategic angle, e.g., 'The Quality Advantage', 'The Price Disruption'."),
    counterHeadline: z.string().describe("A direct, aggressive headline that counters the competitor's message."),
    counterBody: z.string().describe("Ad copy that highlights your product's superiority and exploits the competitor's weakness."),
    counterVisualPrompt: z.string().describe("A detailed DALL-E prompt to generate a visual that one-ups the competitor's visual. Must be photorealistic and compelling."),
    targetAudienceSegment: z.string().describe("A specific sub-segment of the audience to poach from the competitor with this angle."),
});

export const GenerateTakedownPlanOutputSchema = z.object({
  competitorProduct: z.string().describe("The name of the competitor's product identified from the page."),
  competitorBrand: z.string().describe("The name of the competitor's brand identified from the page."),
  takedownAngles: z.array(TakedownAngleSchema).describe("An array of 3 distinct strategic counter-attack angles."),
});
export type GenerateTakedownPlanOutput = z.infer<typeof GenerateTakedownPlanOutputSchema>;

export async function generateTakedownPlan(
  input: GenerateTakedownPlanInput
): Promise<GenerateTakedownPlanOutput> {
  return generateTakedownPlanFlow(input);
}

const takedownPrompt = ai.definePrompt({
  name: 'generateTakedownPlanPrompt',
  input: { schema: z.object({
    pageContent: z.string(),
    yourProductName: z.string(),
    locale: z.string(),
  })},
  output: {schema: GenerateTakedownPlanOutputSchema},
  prompt: `You are AlphaWolf, a ruthless and brilliant marketing strategist. Your mission is to analyze a competitor's product page and devise three distinct "takedown" campaign angles to dominate their market share.

**Your response must be in the following language: {{{locale}}}.**

**Your Product Name:** {{{yourProductName}}}

**Competitor's Page Content (HTML):**
\`\`\`html
{{{pageContent}}}
\`\`\`

**Your Task:**
1.  **Analyze the Enemy:** Read the HTML to understand the competitor's product. Identify their product name, brand, key selling points, and, most importantly, their weaknesses (e.g., high price, missing features, generic messaging, poor reviews mentioned in text).
2.  **Devise 3 Takedown Angles:** Create three unique strategies to counter them. For each angle:
    *   **Angle Name:** Give it a powerful name (e.g., 'The Innovation Play', 'The Unbeatable Value', 'The Superior Quality').
    *   **Counter-Ad Creative:** Write a sharp, direct **headline** and **body copy** for an ad. This copy must highlight a competitor's weakness and position *Your Product* as the superior solution.
    *   **Counter-Visual:** Write a detailed, photorealistic prompt for an AI image generator. This visual should directly challenge or improve upon the competitor's likely imagery. Do not include text in the prompt.
    *   **Targeted Strike:** Identify a specific **audience segment** you can poach from the competitor with this angle (e.g., 'Price-conscious students', 'Disappointed power users').

Your response must be a valid JSON object in the requested language ({{{locale}}}). Be aggressive, be strategic, be the Alpha.`,
});

const generateTakedownPlanFlow = ai.defineFlow(
  {
    name: 'generateTakedownPlanFlow',
    inputSchema: GenerateTakedownPlanInputSchema,
    outputSchema: GenerateTakedownPlanOutputSchema,
  },
  async (input) => {
    const pageContent = await fetchUrlContent(input.url);

    const {output} = await takedownPrompt({
        pageContent,
        yourProductName: input.yourProductName,
        locale: input.locale,
    });

    if (!output) {
        throw new Error('The AI failed to generate a takedown plan.');
    }
    
    return output;
  }
);
