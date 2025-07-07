'use server';
/**
 * @fileOverview AI agent for generating audio from text.
 *
 * - generateAudioAd - A function that handles the text-to-speech process.
 * - GenerateAudioAdInput - The input type for the generateAudioAd function.
 * - GenerateAudioAdOutput - The return type for the generateAudioAd function.
 */
import {ai} from '@/ai/genkit';
import { toWav } from '@/lib/audio';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GenerateAudioAdInputSchema = z.string();
export type GenerateAudioAdInput = z.infer<typeof GenerateAudioAdInputSchema>;

const GenerateAudioAdOutputSchema = z.object({
  audioUrl: z.string().describe('The data URI of the generated audio file.'),
});
export type GenerateAudioAdOutput = z.infer<typeof GenerateAudioAdOutputSchema>;

export async function generateAudioAd(input: GenerateAudioAdInput): Promise<GenerateAudioAdOutput> {
  return generateAudioAdFlow(input);
}

const generateAudioAdFlow = ai.defineFlow(
  {
    name: 'generateAudioAdFlow',
    inputSchema: GenerateAudioAdInputSchema,
    outputSchema: GenerateAudioAdOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioUrl: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
