'use server';

import { generateVideoStoryboard } from "@/ai/flows/generate-video-storyboard";
import { z } from "zod";

const videoStyles = [
  'Dynamic and fast-paced',
  'Cinematic and emotional',
  'Informative and direct',
  'Humorous and quirky',
  'User-generated content style',
] as const;

const formSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  videoStyle: z.enum(videoStyles),
  locale: z.enum(['en', 'fr']),
});

export async function handleVideoGeneration(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      productName: formData.get('productName'),
      productDescription: formData.get('productDescription'),
      targetAudience: formData.get('targetAudience'),
      videoStyle: formData.get('videoStyle'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }
    
    const result = await generateVideoStoryboard(validatedFields.data);

    return { 
        message: 'Storyboard generation complete.', 
        data: result,
        errors: {} 
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Generation failed: ${errorMessage}`, data: null, errors: {} };
  }
}
