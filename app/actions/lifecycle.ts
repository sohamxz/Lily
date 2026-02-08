'use server';

import { promoteUser, terminateUser, getLifecycleEvents } from "@/services/lifecycle";
import { revalidatePath } from "next/cache";

export async function submitPromotion(userId: string, newTitle: string, newSalary: number, reason: string) {
  const result = await promoteUser(userId, newTitle, newSalary, reason);
  revalidatePath('/people');
  return result;
}

export async function submitTermination(userId: string, reason: string) {
  const result = await terminateUser(userId, reason);
  revalidatePath('/people');
  return result;
}

export async function fetchLifecycleHistory(userId: string) {
  return await getLifecycleEvents(userId);
}
