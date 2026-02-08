'use server'

import { orgChartService } from '@/services/org-chart';

export async function getPeopleGraph() {
  try {
    const data = await orgChartService.getGraphData();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch people graph:", error);
    return { success: false, message: 'Failed to load organization chart' };
  }
}
