'use server';
/**
 * @fileOverview AI agent for generating a complete video ad storyboard.
 *
 * - generateVideoStoryboard - A function that handles the video storyboard generation process.
 * - GenerateVideoStoryboardInput - The input type for the generateVideoStoryboard function.
 * - GenerateVideoStoryboardOutput - The return type for the generateVideoStoryboard function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateAdImage} from './generate-ad-image';
import {generateAudioAd} from './generate-audio-ad';

const videoStyles = [
  'Dynamic and fast-paced',
  'Cinematic and emotional',
  'Informative and direct',
  'Humorous and quirky',
  'User-generated content style',
] as const;

const GenerateVideoStoryboardInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z
    .string()
    .describe('A brief description of the product.'),
  targetAudience: z.string().describe('The target audience for the ad.'),
  videoStyle: z
    .enum(videoStyles)
    .describe('The desired style of the video ad.'),
  locale: z
    .enum(['en', 'fr'])
    .optional()
    .default('en')
    .describe('The language for the output.'),
});
export type GenerateVideoStoryboardInput = z.infer<
  typeof GenerateVideoStoryboardInputSchema
>;

const SceneSchema = z.object({
  sceneNumber: z
    .number()
    .describe('The sequential number of the scene (e.g., 1, 2, 3).'),
  script_narration: z
    .string()
    .describe('The voiceover script for this specific scene.'),
  visual_description: z
    .string()
    .describe(
      'A detailed prompt for an AI image model to generate the visual for this scene. Should be descriptive and photorealistic.'
    ),
  duration_seconds: z
    .number()
    .describe('The estimated duration of this scene in seconds.'),
});

const GenerateVideoStoryboardOutputSchema = z.object({
  title: z.string().describe('A catchy title for the video ad concept.'),
  fullScript: z.string().describe('The complete narration script for the entire video ad.'),
  scenes: z
    .array(SceneSchema)
    .describe('An array of 3 to 5 scenes that make up the video storyboard.'),
  audioUrl: z.string().optional().describe('The data URI of the generated voiceover audio.'),
  scenesWithImages: z.array(SceneSchema.extend({
    imageUrl: z.string().optional().describe('The data URI of the generated image for the scene.'),
  })).optional().describe('The scenes with generated image URLs.'),
});
export type GenerateVideoStoryboardOutput = z.infer<
  typeof GenerateVideoStoryboardOutputSchema
>;

export async function generateVideoStoryboard(
  input: GenerateVideoStoryboardInput
): Promise<GenerateVideoStoryboardOutput> {
  return generateVideoStoryboardFlow(input);
}

const storyboardPrompt = ai.definePrompt({
  name: 'generateVideoStoryboardPrompt',
  input: {schema: GenerateVideoStoryboardInputSchema},
  output: {schema: GenerateVideoStoryboardOutputSchema},
  prompt: `You are an expert video advertising director and scriptwriter. Your task is to create a complete storyboard for a short, compelling video ad (15-30 seconds total) based on the provided product information.

**Your response (title, script) must be in the following language: {{{locale}}}.**

**Product Details:**
*   Product Name: {{{productName}}}
*   Description: {{{productDescription}}}
*   Target Audience: {{{targetAudience}}}
*   Video Style: {{{videoStyle}}}

**Instructions:**
1.  Create a catchy **title** for the ad concept.
2.  Break down the ad into 3-5 sequential **scenes**.
3.  For each scene, provide:
    *   sceneNumber: The scene number.
    *   script_narration: The voiceover text for this scene. This should be a part of the larger script.
    *   visual_description: A detailed, vivid prompt for an AI image generation model to create a matching visual. This prompt should describe a photorealistic scene, focusing on the product in context or the emotion to convey. **Do not include any text in the prompt itself.**
    *   duration_seconds: The estimated duration of this scene in seconds. The total duration should be between 15 and 30 seconds.
4.  Combine all script_narration parts into a single fullScript field.

The tone should be engaging and perfectly tailored to the specified target audience and video style. Your response must be in valid JSON format.`,
});

const generateVideoStoryboardFlow = ai.defineFlow(
  {
    name: 'generateVideoStoryboardFlow',
    inputSchema: GenerateVideoStoryboardInputSchema,
    outputSchema: GenerateVideoStoryboardOutputSchema,
  },
  async (input) => {
    // 1. Generate the text-based storyboard structure
    const {output: storyboard} = await storyboardPrompt(input);

    if (!storyboard?.scenes || !storyboard.fullScript) {
      throw new Error('Could not generate storyboard structure.');
    }

    // 2. Generate audio and images in parallel
    const [audioResult, imageResults] = await Promise.all([
      generateAudioAd(storyboard.fullScript),
      Promise.all(
        storyboard.scenes.map((scene) =>
          generateAdImage(scene.visual_description)
        )
      ),
    ]);
    
    // 3. Combine results
    const scenesWithImages = storyboard.scenes.map((scene, index) => ({
        ...scene,
        imageUrl: imageResults[index]?.imageUrl ?? undefined,
    }));

    return {
        ...storyboard,
        audioUrl: audioResult.audioUrl,
        scenesWithImages,
    };
  }
);
