'use server';

import { findLiveAds } from "@/ai/flows/find-live-ads";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters.'),
  country: z.string().min(2, 'Country code is required (e.g., us, fr).'),
  locale: z.enum(['en', 'fr']),
});

export async function getLiveAds(prevState: any, formData: FormData) {
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

    const result = await findLiveAds(validatedFields.data);

    return { data: result, error: null, errors: null };
  } catch (error) {
    console.error('Error in getLiveAds:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    return { data: null, error: `Ad search failed: ${errorMessage}`, errors: null };
  }
}
