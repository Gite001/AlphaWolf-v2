'use server';

import { findWinningProducts } from "@/ai/flows/find-winning-products";
import { getAds } from "@/lib/data";
import { z } from "zod";

const formSchema = z.object({
  adIds: z.string().min(1, 'No ads selected for analysis.'),
  locale: z.enum(['en', 'fr']),
});

export async function getWinningProductsAnalysis(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      adIds: formData.get('adIds'),
      locale: formData.get('locale'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }

    const { adIds, locale } = validatedFields.data;
    const selectedIds = adIds.split(',');
    
    // In a real app, you'd fetch this from a database.
    const allAds = getAds();
    const selectedAds = allAds.filter(ad => selectedIds.includes(ad.id));

    if (selectedAds.length === 0) {
        return { message: 'No matching ads found for analysis.', errors: { adIds: ['No ads found.'] }, data: null };
    }

    const analysisInput = {
      ads: selectedAds.map(ad => ({
        title: ad.title,
        description: ad.description,
        platform: ad.platform,
        likes: ad.engagement.likes,
        comments: ad.engagement.comments,
        shares: ad.engagement.shares,
        score: ad.engagement.score,
      })),
      locale,
    };
    
    const result = await findWinningProducts(analysisInput);

    if (!result || !result.marketOverview || !Array.isArray(result.winningCategories)) {
        throw new Error('Analysis failed to produce a valid result structure.');
    }

    return { data: result, error: null, message: 'Analysis complete.' };
  } catch (error) {
    console.error('Error in getWinningProductsAnalysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    return { data: null, error: `Analysis failed: ${errorMessage}`, message: `Analysis failed: ${errorMessage}` };
  }
}
