'use server';

import { analyzeMarketplaceTrends } from "@/ai/flows/analyze-marketplace-trends";
import { supportedMarketplaces } from "@/lib/types";
import { z } from "zod";

const formSchema = z.object({
  productCategory: z.string().min(3, 'Product category is required.'),
  region: z.string().min(2, 'Region is required.'),
  marketplace: z.enum(supportedMarketplaces),
  locale: z.enum(['en', 'fr']),
});

export async function handlePulseAnalysis(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      productCategory: formData.get('productCategory'),
      region: formData.get('region'),
      marketplace: formData.get('marketplace'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }
    
    const result = await analyzeMarketplaceTrends(validatedFields.data);

    return { message: 'Marketplace analysis complete.', data: result, errors: {} };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Analysis failed: ${errorMessage}`, data: null, errors: {} };
  }
}
