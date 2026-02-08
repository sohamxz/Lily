
import { getPlans, getEnrollments, enrollInPlan } from '../services/benefits';

async function main() {
  console.log("--- Testing Benefits Service ---");

  const userId = 'user-1';

  // 1. Get Plans
  console.log("\n1. Fetching Plans...");
  const plans = await getPlans();
  console.log(`✅ Found ${plans.length} plans.`);

  // 2. Enroll in Medical
  const medicalPlan = plans.find(p => p.type === 'medical');
  if (!medicalPlan) throw new Error("No medical plan found");
  
  console.log(`\n2. Enrolling in ${medicalPlan.name}...`);
  await enrollInPlan(userId, medicalPlan.id);
  
  // 3. Verify Enrollment
  console.log("\n3. Verifying Enrollment...");
  const enrollments = await getEnrollments(userId);
  const myMedical = enrollments.find(e => e.planId === medicalPlan.id);
  
  if (myMedical) {
      console.log(`✅ Successfully enrolled in ${medicalPlan.name}.`);
  } else {
      throw new Error("Enrollment failed.");
  }
  
  // 4. Switch Plan (Test Logic)
  const otherMedical = plans.find(p => p.type === 'medical' && p.id !== medicalPlan.id);
  if (otherMedical) {
      console.log(`\n4. Switching to ${otherMedical.name}...`);
      await enrollInPlan(userId, otherMedical.id);
      
      const newEnrollments = await getEnrollments(userId);
      const hasOld = newEnrollments.find(e => e.planId === medicalPlan.id);
      const hasNew = newEnrollments.find(e => e.planId === otherMedical.id);
      
      if (!hasOld && hasNew) {
          console.log("✅ Successfully switched plans (old removed, new added).");
      } else {
          throw new Error("Switch failed.");
      }
  }

  console.log("\n✅ Benefits Verification Passed!");
}

main().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
