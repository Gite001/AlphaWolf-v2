'use server';

import { generateTakedownPlan } from "@/ai/flows/generate-takedown-plan";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  yourProductName: z.string().min(3, 'Your product name is required.'),
  locale: z.enum(['en', 'fr']),
});

export async function handleTakedownGeneration(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      url: formData.get('url'),
      yourProductName: formData.get('yourProductName'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const result = await generateTakedownPlan(validatedFields.data);

    return { 
        data: result,
        error: null,
        errors: null, 
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Generation failed: ${errorMessage}`, errors: null };
  }
}
