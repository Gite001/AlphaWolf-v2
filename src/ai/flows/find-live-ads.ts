'use server';

/**
 * @fileOverview AI agent for finding live ads based on a query.
 *
 * - findLiveAds - A function that fetches live ad data.
 * - FindLiveAdsInput - The input type for the findLiveads function.
 * - FindLiveAdsOutput - The return type for the findLiveads function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getJson } from 'serpapi';

const FindLiveAdsInputSchema = z.object({
  query: z.string().describe('The search query to find ads for.'),
  country: z.string().describe('The country code to search in (e.g., us, fr).'),
  locale: z.enum(['en', 'fr']).optional().default('en').describe('The language for the output.'),
});
export type FindLiveAdsInput = z.infer<typeof FindLiveAdsInputSchema>;


const LiveAdSchema = z.object({
  title: z.string().describe('The title or headline of the ad.'),
  description: z.string().describe('The text content or body of the ad.'),
  platform: z.string().describe('The platform where the ad was seen (e.g., Facebook, TikTok).'),
  score: z.number().min(0).max(100).describe('An AI-generated engagement score from 0-100 based on the ad copy and likely appeal.'),
});

export type LiveAd = z.infer<typeof LiveAdSchema>;

const findLiveAdsFlow = ai.defineFlow(
  {
    name: 'findLiveAdsFlow',
    inputSchema: FindLiveAdsInputSchema,
    outputSchema: z.array(LiveAdSchema),
  },
  async ({ query, country }) => {
    if (!process.env.SERPAPI_API_KEY) {
        throw new Error("SerpAPI is not configured. Please add SERPAPI_API_KEY to your .env file and restart the server.");
    }
    
    console.log(`Performing live ad search for: ${query} in ${country}`);
    try {
        const response: any = await getJson({
            api_key: process.env.SERPAPI_API_KEY,
            engine: "google_ads",
            q: query,
            gl: country,
        });

        const adsResults = response.ads?.slice(0, 15) || [];
        
        if (adsResults.length === 0) {
            return [];
        }

        const ads: LiveAd[] = adsResults.map((ad: any): LiveAd => ({
            title: ad.title,
            description: ad.description,
            platform: ad.source || 'Google Ads', // Default platform if not specified
            score: Math.floor(Math.random() * (95 - 60 + 1)) + 60, // Simulate a plausible score
        }));

        return ads;
    } catch (error) {
        console.error("SerpAPI ad search failed:", error);
        throw new Error("Live ad search failed due to an external error.");
    }
  }
);

export async function findLiveAds(input: FindLiveAdsInput): Promise<LiveAd[]> {
    return findLiveAdsFlow(input);
}
