import { z } from 'zod';
import { CreateTimeOffRequestSchema } from '@/lib/schemas';

// Mock DB Storage
let MOCK_TIME_OFF_REQUESTS: any[] = [];

export class TimeOffService {
  async createTimeOffRequest(data: z.infer<typeof CreateTimeOffRequestSchema>) {
    // Validate input
    const validated = CreateTimeOffRequestSchema.parse(data);

    // Simulate DB Insert
    const newRequest = {
      id: crypto.randomUUID(),
      userId: 'mock-user-id', // In a real app, this comes from auth context
      startDate: validated.startDate,
      endDate: validated.endDate,
      type: validated.type,
      status: 'pending',
      reason: validated.reason,
      createdAt: new Date(),
    };

    MOCK_TIME_OFF_REQUESTS.push(newRequest);
    
    // Simulate DB Latency
    await new Promise(resolve => setTimeout(resolve, 500));

    return newRequest;
  }

  async getTimeOffRequests() {
    // Simulate DB Select
    return MOCK_TIME_OFF_REQUESTS;
  }
}

export const timeOffService = new TimeOffService();
