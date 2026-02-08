'use server';

import { getExpenses, createExpense, approveExpense, rejectExpense } from "@/services/expenses";
import { revalidatePath } from "next/cache";

export async function fetchMyExpenses() {
  return await getExpenses('user-1');
}

export async function submitExpense(data: any) {
  const result = await createExpense('user-1', data);
  revalidatePath('/expenses');
  return result;
}

export async function approveUserExpense(expenseId: string) {
  const result = await approveExpense(expenseId);
  revalidatePath('/expenses');
  return result;
}

export async function rejectUserExpense(expenseId: string) {
  const result = await rejectExpense(expenseId);
  revalidatePath('/expenses');
  return result;
}
