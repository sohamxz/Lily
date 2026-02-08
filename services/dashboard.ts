import { MOCK_ACTION_ITEMS, MOCK_USERS } from '@/lib/data';

export class DashboardService {
  async getActionItems() {
    // Simulate DB Latency
    await new Promise(resolve => setTimeout(resolve, 150));
    return MOCK_ACTION_ITEMS;
  }

  async getTeamPulse() {
    // Simulate DB Latency
    await new Promise(resolve => setTimeout(resolve, 150));
    return MOCK_USERS.map(u => ({
        name: u.name.split(' ')[0], // First name only
        mood: u.mood,
        status: u.status
    }));
  }
}

export const dashboardService = new DashboardService();
