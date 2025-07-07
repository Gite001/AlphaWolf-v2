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
        data: null,
        error: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const result = await defineAdTerm(validatedFields.data);

    return { 
        data: {
            ...result,
            term: validatedFields.data.term,
        },
        error: null,
        errors: null,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Generation failed: ${errorMessage}`, errors: null };
  }
}
