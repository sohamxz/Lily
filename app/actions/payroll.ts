'use server';

import { getCompensation, getPayslips, getLatestPayslip } from "@/services/payroll";
import { getUser } from "./user"; // Assuming this exists or I need to mock it

export async function fetchMyCompensation() {
  const user = await getUser(); // Mock user
  if (!user) return null;
  // Use mock ID 'user-1' if user doesn't have ID, or rely on service to ignore ID for now
  return await getCompensation('user-1'); 
}

export async function fetchMyPayslips() {
  return await getPayslips('user-1');
}

export async function fetchLatestPayslip() {
  return await getLatestPayslip('user-1');
}
