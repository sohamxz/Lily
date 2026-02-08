'use server';

import { getGoals, createGoal, updateKeyResult } from "@/services/goals";
import { revalidatePath } from "next/cache";

export async function fetchMyGoals() {
  return await getGoals('user-1');
}

export async function submitGoal(data: any) {
  const result = await createGoal('user-1', data);
  revalidatePath('/goals');
  return result;
}

export async function updateKRProgress(krId: string, value: number) {
  const result = await updateKeyResult(krId, value);
  revalidatePath('/goals');
  return result;
}
