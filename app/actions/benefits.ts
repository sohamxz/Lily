'use server';

import { getPlans, getEnrollments, enrollInPlan } from "@/services/benefits";
import { revalidatePath } from "next/cache";

export async function fetchBenefitPlans() {
  return await getPlans();
}

export async function fetchMyEnrollments() {
  return await getEnrollments('user-1');
}

export async function enrollUserInPlan(planId: string) {
  const result = await enrollInPlan('user-1', planId);
  revalidatePath('/benefits');
  return result;
}
