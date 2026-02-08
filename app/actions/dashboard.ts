'use server'

import { dashboardService } from '@/services/dashboard';

export async function getDashboardData() {
  try {
    const [actionItems, teamPulse] = await Promise.all([
      dashboardService.getActionItems(),
      dashboardService.getTeamPulse()
    ]);
    
    return { success: true, data: { actionItems, teamPulse } };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { success: false, message: 'Failed to load dashboard data' };
  }
}
