'use server';

import { summarizeDashboardData } from '@/ai/flows/summarize-dashboard-data';
import type { Stat, EngagementData } from '@/lib/types';

export async function getDashboardSummary(stats: Stat[], engagementData: EngagementData[], locale: 'en' | 'fr' = 'en') {
  try {
    const serializableStats = stats.map(({ icon, ...rest }) => rest);
    
    const result = await summarizeDashboardData({
      stats: serializableStats,
      engagementData,
      locale,
    });
    return { data: result, error: null };
  } catch (error) {
    console.error('Error in getDashboardSummary:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to get summary: ${errorMessage}` };
  }
}
