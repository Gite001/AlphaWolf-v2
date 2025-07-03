'use server';

import { generateAdCopy } from "@/ai/flows/generate-ad-copy";
import { generateAdImage } from "@/ai/flows/generate-ad-image";
import { generateAudioAd } from "@/ai/flows/generate-audio-ad";
import { z } from "zod";

const formSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  keywords: z.string().optional(),
  locale: z.enum(['en', 'fr']),
});

export async function handleCopyGeneration(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      productName: formData.get('productName'),
      productDescription: formData.get('productDescription'),
      targetAudience: formData.get('targetAudience'),
      keywords: formData.get('keywords'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }
    
    const result = await generateAdCopy({
        ...validatedFields.data,
        keywords: validatedFields.data.keywords || '',
    });

    return { 
        message: 'Copy generation complete.', 
        data: {
            variations: result.variations,
            originalInput: validatedFields.data,
        }, 
        errors: {} 
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Generation failed: ${errorMessage}`, data: null, errors: {} };
  }
}

export async function generateVariationImage(prompt: string) {
  try {
    const result = await generateAdImage(prompt);
    if (!result.imageUrl) throw new Error('Image generation returned no URL.');
    return { data: result, error: null };
  } catch (error) {
    console.error('Error in generateVariationImage:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Image generation failed: ${errorMessage}` };
  }
}

export async function generateVariationAudio(text: string) {
  try {
    const result = await generateAudioAd(text);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error in generateVariationAudio:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Audio generation failed: ${errorMessage}` };
  }
}
