
import { getGoals, createGoal, updateKeyResult } from '../services/goals';

async function main() {
  console.log("--- Testing Goals Service ---");

  const userId = 'user-1';

  // 1. Get Goals
  console.log("\n1. Fetching Goals...");
  const goals = await getGoals(userId);
  console.log(`✅ Found ${goals.length} goals.`);
  if (goals.length > 0) {
      console.log(`- Goal: ${goals[0].title} (${goals[0].progress}%)`);
  }

  // 2. Create Goal
  console.log("\n2. Creating Goal...");
  const newGoal = await createGoal(userId, {
      title: "Improve Engineering Culture",
      dueDate: "2024-12-31",
      keyResults: [
          { title: "Host 12 Tech Talks", targetValue: 12, unit: "number" }
      ]
  });
  console.log(`✅ Created goal: ${newGoal.title}`);

  // 3. Update Progress
  console.log("\n3. Updating Progress...");
  const kr = newGoal.keyResults[0];
  await updateKeyResult(kr.id, 6); // 50%
  
  const updatedGoals = await getGoals(userId);
  const updatedGoal = updatedGoals.find(g => g.id === newGoal.id);
  
  if (updatedGoal?.progress === 50) {
      console.log("✅ Progress updated correctly to 50%.");
  } else {
      throw new Error(`Progress mismatch: ${updatedGoal?.progress}%`);
  }

  console.log("\n✅ Goals Verification Passed!");
}

main().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
