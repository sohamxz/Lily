
import { getCompensation, getPayslips } from '../services/payroll';

async function main() {
  console.log("--- Testing Payroll Service ---");

  const userId = 'user-1';

  // 1. Get Compensation
  console.log("\n1. Fetching Compensation...");
  const comp = await getCompensation(userId);
  if (!comp) throw new Error("No compensation found");
  console.log(`✅ Compensation: ${comp.amount / 100} ${comp.currency}/yr`);

  // 2. Get Payslips
  console.log("\n2. Fetching Payslips...");
  const slips = await getPayslips(userId);
  console.log(`✅ Found ${slips.length} payslips.`);
  
  if (slips.length > 0) {
      console.log(`- Latest: ${slips[0].periodEnd}, Net: $${slips[0].netPay/100}`);
  }

  console.log("\n✅ Payroll Verification Passed!");
}

main().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
