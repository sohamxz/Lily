import { z } from 'zod';

export const GetTimeOffBalanceSchema = z.object({
  type: z.enum(['vacation', 'sick', 'personal']).optional().describe('The type of time off balance to retrieve. If not provided, returns all.'),
});

export const GetTeamStatusSchema = z.object({
  name: z.string().optional().describe('Filter by team member name'),
});

export const GetInsightsSchema = z.object({
    metric: z.enum(['burn_rate', 'attrition_risk']).describe('The metric to analyze')
});

export const CreateTimeOffRequestSchema = z.object({
  startDate: z.string().describe('The start date of the time off request (YYYY-MM-DD)'),
  endDate: z.string().describe('The end date of the time off request (YYYY-MM-DD)'),
  type: z.enum(['vacation', 'sick', 'personal']),
  reason: z.string().optional(),
});
