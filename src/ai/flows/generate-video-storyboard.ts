'use server';
/**
 * @fileOverview AI agent for generating a complete video ad storyboard with all media.
 *
 * - generateVideoStoryboard - A function that handles the video storyboard generation process.
 * - GenerateVideoStoryboardInput - The input type for the generateVideoStoryboard function.
 * - GenerateVideoStoryboardOutput - The return type for the generateVideoStoryboard function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

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

// SceneSchema now includes the generated image URL
export const SceneSchema = z.object({
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
  imageUrl: z.string().nullable().describe("The data URI of the generated visual for this scene. Null if generation failed.")
});
export type Scene = z.infer<typeof SceneSchema>;


// Output schema now includes all media URLs.
const GenerateVideoStoryboardOutputSchema = z.object({
  title: z.string().describe('A catchy title for the video ad concept.'),
  fullScript: z
    .string()
    .describe('The complete narration script for the entire video ad.'),
  audioUrl: z.string().nullable().describe("The data URI of the generated audio for the full script. Null if generation failed."),
  scenes: z
    .array(SceneSchema)
    .describe('An array of 3 to 5 scenes that make up the video storyboard, each with a generated image URL.'),
});
export type GenerateVideoStoryboardOutput = z.infer<
  typeof GenerateVideoStoryboardOutputSchema
>;

export async function generateVideoStoryboard(
  input: GenerateVideoStoryboardInput
): Promise<GenerateVideoStoryboardOutput> {
  return generateVideoStoryboardFlow(input);
}

// Re-using the storyboard prompt to just get the text structure first.
// The output schema for this prompt should not contain media URLs.
const StoryboardTextPromptOutputSchema = z.object({
  title: z.string(),
  fullScript: z.string(),
  scenes: z.array(z.object({
      sceneNumber: z.number(),
      script_narration: z.string(),
      visual_description: z.string(),
      duration_seconds: z.number(),
  }))
});

const storyboardPrompt = ai.definePrompt({
  name: 'generateVideoStoryboardTextPrompt',
  input: {schema: GenerateVideoStoryboardInputSchema},
  output: {schema: StoryboardTextPromptOutputSchema},
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
    *   script_narration: The voiceover text for this scene. This is a part of the larger script.
    *   visual_description: A detailed, vivid prompt for an AI image generation model to create a matching visual. This prompt should describe a photorealistic scene, focusing on the product in context or the emotion to convey. **Do not include any text in the prompt itself.**
    *   duration_seconds: The estimated duration of this scene in seconds. The total duration should be between 15 and 30 seconds.
4.  Combine all script_narration parts into a single fullScript field.

The tone should be engaging and perfectly tailored to the specified target audience and video style. Your response must be in valid JSON format.`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });
    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}

// The new, improved flow that orchestrates everything.
const generateVideoStoryboardFlow = ai.defineFlow(
  {
    name: 'generateVideoStoryboardFlow',
    inputSchema: GenerateVideoStoryboardInputSchema,
    outputSchema: GenerateVideoStoryboardOutputSchema,
  },
  async (input) => {
    // 1. Get the text-based storyboard structure.
    const { output: textStoryboard } = await storyboardPrompt(input);
    if (!textStoryboard?.scenes) {
      throw new Error('Could not generate storyboard structure.');
    }
    
    // 2. Concurrently generate all media assets.
    const [audioResult, ...imageResults] = await Promise.allSettled([
        // Generate audio for the full script
        ai.generate({
          model: googleAI.model('gemini-2.5-flash-preview-tts'),
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } } },
          },
          prompt: textStoryboard.fullScript,
        }),
        // Generate an image for each scene
        ...textStoryboard.scenes.map(scene => 
            ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `A professional, photorealistic advertisement image. The image should be: ${scene.visual_description}`,
                config: { responseModalities: ['TEXT', 'IMAGE'] },
            })
        ),
    ]);
    
    // 3. Process audio result
    let audioUrl: string | null = null;
    if (audioResult.status === 'fulfilled' && audioResult.value.media) {
        const media = audioResult.value.media;
        const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
        audioUrl = 'data:audio/wav;base64,' + await toWav(audioBuffer);
    } else {
        console.error("Audio generation failed:", audioResult.status === 'rejected' ? audioResult.reason : "No media returned");
    }
    
    // 4. Combine text storyboard with generated image URLs
    const scenesWithImages = textStoryboard.scenes.map((scene, index) => {
        const imageResult = imageResults[index];
        const imageUrl = (imageResult.status === 'fulfilled' && imageResult.value.media) ? imageResult.value.media.url : null;
        if (imageResult.status === 'rejected') {
            console.error(`Image generation for scene ${index+1} failed:`, imageResult.reason);
        }
        return {
            ...scene,
            imageUrl,
        };
    });

    // 5. Return the complete package
    return {
        title: textStoryboard.title,
        fullScript: textStoryboard.fullScript,
        scenes: scenesWithImages,
        audioUrl,
    };
  }
);
