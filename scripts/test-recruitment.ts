
import { getJobPostings, getCandidates, updateCandidateStage, rankCandidates } from '../services/recruitment';

// We import directly from services to avoid "revalidatePath" errors in the standalone script context.
// The Server Actions in app/actions/recruitment.ts are just thin wrappers around these services.

async function main() {
  console.log("--- Testing Recruitment Pipeline (Service Layer) ---");

  // 1. Fetch Job Postings
  console.log("\n1. Fetching Job Postings...");
  const jobs = await getJobPostings();
  if (jobs.length === 0) throw new Error("No jobs found");
  console.log(`✅ Found ${jobs.length} jobs.`);
  console.log(`- Sample: ${jobs[0].title} (${jobs[0].id})`);

  const jobId = jobs[0].id;

  // 2. Fetch Candidates
  console.log(`\n2. Fetching Candidates for Job ${jobId}...`);
  let candidates = await getCandidates(jobId);
  console.log(`✅ Found ${candidates.length} candidates.`);
  
  if (candidates.length === 0) {
      console.log("No candidates to test ranking on.");
      return;
  }

  // 3. Test AI Ranking
  console.log("\n3. Running AI Ranking...");
  const rankedCandidates = await rankCandidates(jobId);
  console.log("✅ Ranking complete.");
  console.log("Top Candidate:", rankedCandidates[0].name, "Score:", rankedCandidates[0].aiScore);

  // 4. Move Candidate
  const candidateToMove = candidates[0];
  const newStage = "interview";
  console.log(`\n4. Moving candidate ${candidateToMove.name} to '${newStage}'...`);
  await updateCandidateStage(candidateToMove.id, newStage);
  
  // Verify move
  const updatedCandidates = await getCandidates(jobId);
  const updatedCandidate = updatedCandidates.find(c => c.id === candidateToMove.id);
  
  if (updatedCandidate?.stage === newStage) {
      console.log(`✅ Candidate successfully moved to ${newStage}.`);
  } else {
      throw new Error(`❌ Failed to move candidate. Status is ${updatedCandidate?.stage}`);
  }

  console.log("\n✅ Recruitment Verification Passed!");
}

main().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
