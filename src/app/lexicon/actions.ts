'use server';

import { defineAdTerm } from "@/ai/flows/define-ad-term";
import { z } from "zod";

const formSchema = z.object({
  term: z.string().min(2, 'Term must be at least 2 characters.'),
  locale: z.enum(['en', 'fr']),
});

export async function handleTermDefinition(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      term: formData.get('term'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }
    
    const result = await defineAdTerm(validatedFields.data);

    return { 
        message: 'Definition complete.', 
        data: {
            ...result,
            term: validatedFields.data.term,
        },
        errors: {} 
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Generation failed: ${errorMessage}`, data: null, errors: {} };
  }
}
