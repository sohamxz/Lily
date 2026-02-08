import { dashboardService } from '../services/dashboard';

async function testDashboard() {
  console.log("🧪 Starting Dashboard Service Verification...");
  try {
    const actions = await dashboardService.getActionItems();
    if (!Array.isArray(actions)) throw new Error("Action items should be an array");
    
    const pulse = await dashboardService.getTeamPulse();
    if (!Array.isArray(pulse)) throw new Error("Team pulse should be an array");
    
    console.log("✅ Dashboard Fetch: Passed");
  } catch (error) {
    console.error("❌ Verification Failed:", error);
    process.exit(1);
  }
}

testDashboard();
