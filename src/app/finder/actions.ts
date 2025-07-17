'use server';

import { findWinningProducts } from "@/ai/flows/find-winning-products";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters.'),
  country: z.string().min(2, 'Country code is required (e.g., us, fr).'),
  locale: z.enum(['en', 'fr']),
});

export async function getWinningProducts(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      query: formData.get('query'),
      country: formData.get('country'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const result = await findWinningProducts(validatedFields.data);

    if (!result || !result.marketOverview || !Array.isArray(result.winningCategories)) {
        throw new Error('Analysis failed to produce a valid result structure.');
    }

    return { data: result, error: null, errors: null };
  } catch (error) {
    console.error('Error in getWinningProducts:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    return { data: null, error: `Analysis failed: ${errorMessage}`, errors: null };
  }
}
```