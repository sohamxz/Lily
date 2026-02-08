'use server'

import { timeOffService } from '@/services/time-off';
import { CreateTimeOffRequestSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function submitTimeOffRequest(prevState: any, formData: FormData) {
  try {
    const rawData = {
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      type: formData.get('type'),
      reason: formData.get('reason') || undefined,
    };

    // Validate using Zod
    const validatedData = CreateTimeOffRequestSchema.parse(rawData);

    // Call Service
    const request = await timeOffService.createTimeOffRequest(validatedData);

    return { success: true, message: 'Time off request submitted successfully!', request };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Invalid input data', errors: error.errors };
    }
    return { success: false, message: 'Failed to submit request' };
  }
}
