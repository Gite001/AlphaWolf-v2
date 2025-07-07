'use server';

import { generateMarketingPlan } from "@/ai/flows/generate-marketing-plan";
import { budgetLevels, marketingGoals } from "@/lib/types";
import { z } from "zod";

const formSchema = z.object({
  productName: z.string().min(3, 'Product name is required.'),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  budgetLevel: z.enum(budgetLevels),
  marketingGoal: z.enum(marketingGoals),
  locale: z.enum(['en', 'fr']),
});

export async function handlePlanGeneration(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      productName: formData.get('productName'),
      productDescription: formData.get('productDescription'),
      targetAudience: formData.get('targetAudience'),
      budgetLevel: formData.get('budgetLevel'),
      marketingGoal: formData.get('marketingGoal'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        data: null,
        error: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const result = await generateMarketingPlan(validatedFields.data);

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
