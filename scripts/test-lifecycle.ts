
import { promoteUser, terminateUser, getLifecycleEvents } from '../services/lifecycle';

async function main() {
  console.log("--- Testing Lifecycle Service ---");

  const userId = 'user-1';

  // 1. Promote
  console.log("\n1. Promoting User...");
  const promo = await promoteUser(userId, "Senior Principal Engineer", 25000000, "Outstanding performance");
  console.log(`✅ Promoted to ${promo.newValue.title}`);

  // 2. Terminate (Simulated)
  console.log("\n2. Terminating User...");
  const term = await terminateUser(userId, "Better opportunity");
  console.log(`✅ Terminated: ${term.type}`);

  // 3. History
  console.log("\n3. Fetching History...");
  const history = await getLifecycleEvents(userId);
  console.log(`✅ Found ${history.length} events.`);
  
  if (history.length >= 2) {
      console.log("✅ History persisted correctly.");
  } else {
      throw new Error("History missing.");
  }

  console.log("\n✅ Lifecycle Verification Passed!");
}

main().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
