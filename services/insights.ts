import { MOCK_INSIGHTS_DATA } from '@/lib/data';

export class InsightsService {
  async getInsights() {
    // Simulate DB Latency
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would perform complex aggregation queries
    return MOCK_INSIGHTS_DATA;
  }
}

export const insightsService = new InsightsService();
