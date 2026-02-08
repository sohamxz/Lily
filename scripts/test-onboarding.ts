
import { getWorkflow, getTasks, completeTask } from '../services/onboarding';

async function main() {
  console.log("--- Testing Onboarding Service ---");

  const userId = 'user-1';

  // 1. Get Workflow
  console.log("\n1. Fetching Workflow...");
  const wf = await getWorkflow(userId);
  if (!wf) throw new Error("No workflow found");
  
  // Clone initial progress to avoid reference mutation issues
  const initialProgress = wf.progress;
  console.log(`✅ Workflow: ${wf.title}, Progress: ${initialProgress}%`);

  // 2. Get Tasks
  console.log("\n2. Fetching Tasks...");
  let tasks = await getTasks(wf.id);
  console.log(`✅ Found ${tasks.length} tasks.`);
  
  const pendingTask = tasks.find(t => t.status === 'pending');
  if (!pendingTask) {
      console.log("No pending tasks to test completion.");
      return;
  }

  // 3. Complete Task
  console.log(`\n3. Completing task '${pendingTask.title}'...`);
  await completeTask(pendingTask.id);
  
  const updatedWf = await getWorkflow(userId);
  console.log(`✅ Task completed. New Progress: ${updatedWf?.progress}%`);
  
  if ((updatedWf?.progress || 0) > (initialProgress || 0)) {
       console.log("✅ Progress increased.");
  } else {
       throw new Error(`Progress did not increase. Old: ${initialProgress}, New: ${updatedWf?.progress}`);
  }

  console.log("\n✅ Onboarding Verification Passed!");
}

main().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
