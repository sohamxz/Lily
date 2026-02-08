'use server';

import { getJobPostings, getCandidates, moveCandidate, rankCandidates } from "@/services/recruitment";
import { revalidatePath } from "next/cache";

export async function fetchJobPostings() {
  return await getJobPostings();
}

export async function fetchCandidates(jobId: string) {
  return await getCandidates(jobId);
}

export async function updateCandidateStage(candidateId: string, stage: string, jobId: string) {
  const result = await moveCandidate(candidateId, stage);
  revalidatePath(`/recruitment/${jobId}`);
  return result;
}

export async function runAIRanking(jobId: string) {
  const result = await rankCandidates(jobId);
  revalidatePath(`/recruitment/${jobId}`);
  return result;
}
