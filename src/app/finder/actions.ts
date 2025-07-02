'use server';

import { findWinningProducts } from "@/ai/flows/find-winning-products";
import { ads } from "@/lib/data";

export async function getWinningProductsAnalysis(locale: 'en' | 'fr' = 'en') {
  try {
    // In a real app, you'd fetch this from a database.
    // Here, we're using mock data.
    const analysisInput = {
      ads: ads.map(ad => ({
        title: ad.title,
        platform: ad.platform,
        score: ad.engagement.score,
      })),
      locale,
    };
    
    const result = await findWinningProducts(analysisInput);

    return { data: result, error: null };
  } catch (error) {
    console.error('Error in getWinningProductsAnalysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Analysis failed: ${errorMessage}` };
  }
}
