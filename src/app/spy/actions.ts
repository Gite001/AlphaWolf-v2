'use server';

import { analyzeCompetitorAd } from "@/ai/flows/analyze-competitor-ad";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  pageContent: z.string().optional(),
  locale: z.enum(['en', 'fr']),
}).refine(data => !!data.url || !!data.pageContent, {
    message: "A URL or page content is required.",
    path: ["url"],
});

export async function handleCompetitorAnalysis(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      url: formData.get('url'),
      pageContent: formData.get('pageContent'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }
    
    const result = await analyzeCompetitorAd({
        ...validatedFields.data,
        url: validatedFields.data.url || undefined,
    });

    return { message: 'Competitor analysis complete.', data: result, errors: {} };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Analysis failed: ${errorMessage}`, data: null, errors: {} };
  }
}
