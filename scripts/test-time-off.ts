import { timeOffService } from '../services/time-off';

async function verifyTimeOffService() {
  console.log("🧪 Starting TimeOffService Verification...");

  try {
    // Test Creation
    const request = await timeOffService.createTimeOffRequest({
      startDate: '2024-03-10',
      endDate: '2024-03-15',
      type: 'vacation',
      reason: 'Trip to Hawaii',
    });

    if (!request.id || request.status !== 'pending') {
      throw new Error("Creation failed: Invalid response structure");
    }
    console.log("✅ Create Request: Passed");

    // Test Retrieval
    const requests = await timeOffService.getTimeOffRequests();
    if (requests.length !== 1 || requests[0].id !== request.id) {
        throw new Error("Retrieval failed: Request not found in list");
    }
    console.log("✅ Get Requests: Passed");

  } catch (error) {
    console.error("❌ Verification Failed:", error);
    process.exit(1);
  }
}

verifyTimeOffService();
