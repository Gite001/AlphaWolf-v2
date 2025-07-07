'use server';

import { analyzeMarketTrends } from "@/ai/flows/analyze-market-trends";
import { z } from "zod";

const formSchema = z.object({
  productCategory: z.string().min(3, 'Product category is required.'),
  region: z.string().min(2, 'Region is required.'),
  locale: z.enum(['en', 'fr']),
});

export async function handleTrendsAnalysis(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      productCategory: formData.get('productCategory'),
      region: formData.get('region'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const result = await analyzeMarketTrends(validatedFields.data);

    return { data: result, error: null, errors: {} };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Analysis failed: ${errorMessage}`, errors: {} };
  }
}
