import { insightsService } from '../services/insights';

async function testInsights() {
  console.log("🧪 Starting Insights Service Verification...");
  try {
    const data = await insightsService.getInsights();
    if (!data.burn_rate || !data.attrition_risk) throw new Error("Invalid insights data structure");
    console.log("✅ Insights Fetch: Passed");
  } catch (error) {
    console.error("❌ Verification Failed:", error);
    process.exit(1);
  }
}

testInsights();
