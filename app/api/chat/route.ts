import { streamText, tool } from 'ai';
import { z } from 'zod';
import { MOCK_TIME_OFF_BALANCES, MOCK_USERS, MOCK_INSIGHTS_DATA } from '@/lib/data';
import { GetTimeOffBalanceSchema, GetTeamStatusSchema, GetInsightsSchema } from '@/lib/schemas';
import { MockLanguageModel } from '@/lib/mock-model';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: new MockLanguageModel(), // Use Mock Model
      messages,
      system: `You are the FlowState AI Assistant.`,
      tools: {
        getTimeOffBalance: tool({
          description: 'Get the current user time off balances (vacation, sick, personal).',
          parameters: GetTimeOffBalanceSchema,
          execute: async ({ type }) => {
            if (type) {
              return { [type]: MOCK_TIME_OFF_BALANCES[type as keyof typeof MOCK_TIME_OFF_BALANCES] };
            }
            return MOCK_TIME_OFF_BALANCES;
          },
        }),
      },
    });

    // Fallback logic for older AI SDK versions if toDataStreamResponse is missing
    if (typeof result.toDataStreamResponse === 'function') {
        return result.toDataStreamResponse();
    } else if (typeof (result as any).toTextStreamResponse === 'function') {
         // Fallback to text stream if data stream is not available
         return (result as any).toTextStreamResponse();
    } else {
        // Absolute fallback: manual stream response
        return new Response((result as any).textStream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }

  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
}
