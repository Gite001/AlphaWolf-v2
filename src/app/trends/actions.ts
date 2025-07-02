'use server';

import { analyzeMarketTrends } from "@/ai/flows/analyze-market-trends";
import { z } from "zod";

const formSchema = z.object({
  productCategory: z.string().min(3, 'Product category is required.'),
  region: z.string().min(2, 'Region is required.'),
});

export async function handleTrendsAnalysis(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      productCategory: formData.get('productCategory'),
      region: formData.get('region'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }
    
    const result = await analyzeMarketTrends(validatedFields.data);

    return { message: 'Market analysis complete.', data: result, errors: {} };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Analysis failed: ${errorMessage}`, data: null, errors: {} };
  }
}
