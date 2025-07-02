'use server';

import { analyzeAdPerformance } from "@/ai/flows/analyze-ad-performance";
import { z } from "zod";

const formSchema = z.object({
  adText: z.string().min(10, 'Ad text must be at least 10 characters.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  productType: z.string().min(3, 'Product type is required.'),
  adVisual: z.instanceof(File).refine(file => file.size > 0, 'Ad visual is required.'),
  locale: z.enum(['en', 'fr']),
});

export async function handleAnalysis(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      adText: formData.get('adText'),
      targetAudience: formData.get('targetAudience'),
      productType: formData.get('productType'),
      adVisual: formData.get('adVisual'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const { adVisual, ...rest } = validatedFields.data;

    if (adVisual.size > 4 * 1024 * 1024) { // 4MB limit
        return { message: 'Image size must be less than 4MB.', errors: { adVisual: ['Image too large'] } };
    }

    const bytes = await adVisual.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const adVisualDataUri = `data:${adVisual.type};base64,${buffer.toString('base64')}`;

    const analysisInput = {
      ...rest,
      adVisualDataUri,
    };

    const result = await analyzeAdPerformance(analysisInput);

    return { message: 'Analysis complete.', data: result, errors: {} };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Analysis failed: ${errorMessage}`, data: null, errors: {} };
  }
}
