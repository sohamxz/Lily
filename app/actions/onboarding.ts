'use server';

import { getWorkflow, getTasks, completeTask } from "@/services/onboarding";
import { revalidatePath } from "next/cache";

export async function fetchMyWorkflow() {
  return await getWorkflow('user-1');
}

export async function fetchWorkflowTasks(workflowId: string) {
  return await getTasks(workflowId);
}

export async function markTaskComplete(taskId: string) {
  const result = await completeTask(taskId);
  revalidatePath('/onboarding');
  return result;
}
