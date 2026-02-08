'use server'

import { insightsService } from '@/services/insights';

export async function getInsightsData() {
  try {
    const data = await insightsService.getInsights();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return { success: false, message: 'Failed to load insights data' };
  }
}
