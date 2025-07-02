'use server';

import { generateAdCopy } from "@/ai/flows/generate-ad-copy";
import { generateAdVisual } from "@/ai/flows/generate-ad-visual";
import { z } from "zod";

const formSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  keywords: z.string().optional(),
});

export async function handleCopyGeneration(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      productName: formData.get('productName'),
      productDescription: formData.get('productDescription'),
      targetAudience: formData.get('targetAudience'),
      keywords: formData.get('keywords'),
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

const visualGenerationSchema = z.object({
    productName: z.string(),
    productDescription: z.string(),
    headline: z.string(),
    body: z.string(),
});

export async function handleVisualGeneration(input: unknown) {
    try {
        const validatedFields = visualGenerationSchema.safeParse(input);
        if (!validatedFields.success) {
            return { error: 'Invalid input for visual generation.' };
        }

        const imageUrl = await generateAdVisual(validatedFields.data);
        return { imageUrl };

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { error: `Visual generation failed: ${errorMessage}` };
    }
}
