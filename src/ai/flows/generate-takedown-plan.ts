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
import { fetchUrlContent } from '@/lib/network';

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

// This is the final output schema, including the generated image URL.
const TakedownAngleWithMediaSchema = TakedownAngleSchema.extend({
    imageUrl: z.string().nullable().describe("The data URI of the generated ad visual. Null if generation failed."),
});

export const GenerateTakedownPlanOutputSchema = z.object({
  competitorProduct: z.string().describe("The name of the competitor's product identified from the page."),
  competitorBrand: z.string().describe("The name of the competitor's brand identified from the page."),
  takedownAngles: z.array(TakedownAngleWithMediaSchema).describe("An array of 3 distinct strategic counter-attack angles with generated visuals."),
});
export type GenerateTakedownPlanOutput = z.infer<typeof GenerateTakedownPlanOutputSchema>;


export async function generateTakedownPlan(
  input: GenerateTakedownPlanInput
): Promise<GenerateTakedownPlanOutput> {
  return generateTakedownPlanFlow(input);
}

// Prompt for just the text part of the takedown plan
const takedownTextPrompt = ai.definePrompt({
  name: 'generateTakedownTextPrompt',
  input: { schema: z.object({
    pageContent: z.string(),
    yourProductName: z.string(),
    locale: z.string(),
  })},
  output: {schema: z.object({
    competitorProduct: z.string(),
    competitorBrand: z.string(),
    takedownAngles: z.array(TakedownAngleSchema),
  })},
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
    // 1. Fetch competitor content
    const pageContent = await fetchUrlContent(input.url);

    // 2. Generate the text-based takedown plan
    const {output: textPlan} = await takedownTextPrompt({
        pageContent,
        yourProductName: input.yourProductName,
        locale: input.locale,
    });

    if (!textPlan || !textPlan.takedownAngles) {
        throw new Error('The AI failed to generate a text-based takedown plan.');
    }

    // 3. For each angle, generate the visual in parallel.
    const anglesWithMedia = await Promise.all(
        textPlan.takedownAngles.map(async (angle) => {
            const imageResult = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `A professional, photorealistic advertisement image. The image should be: ${angle.counterVisualPrompt}`,
                config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                },
            });
            
            const imageUrl = imageResult.media?.url ?? null;
            if (!imageUrl) {
                console.error('Image generation failed for takedown angle:', angle.angleName);
            }

            return {
                ...angle,
                imageUrl,
            };
        })
    );
    
    // 4. Combine and return the full plan
    return {
        competitorProduct: textPlan.competitorProduct,
        competitorBrand: textPlan.competitorBrand,
        takedownAngles: anglesWithMedia,
    };
  }
);
