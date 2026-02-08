
import { getExpenses, createExpense, approveExpense } from '../services/expenses';

async function main() {
  console.log("--- Testing Expense Service ---");

  const userId = 'user-1';

  // 1. Get Expenses
  console.log("\n1. Fetching Expenses...");
  const initial = await getExpenses(userId);
  console.log(`✅ Found ${initial.length} expenses.`);

  // 2. Create Expense
  console.log("\n2. Creating Expense...");
  const newExp = await createExpense(userId, {
      amount: 5000,
      category: 'supplies',
      merchant: 'Office Depot',
      description: 'Pens and paper'
  });
  console.log(`✅ Created expense for ${newExp.merchant}`);

  // 3. Approve Expense
  console.log(`\n3. Approving Expense ${newExp.id}...`);
  const approved = await approveExpense(newExp.id);
  
  if (approved?.status === 'approved') {
      console.log("✅ Expense approved.");
  } else {
      throw new Error("Approval failed.");
  }
  
  // 4. Verify List
  const final = await getExpenses(userId);
  if (final.length === initial.length + 1) {
      console.log("✅ Expense list updated.");
  } else {
      throw new Error("List count mismatch.");
  }

  console.log("\n✅ Expense Verification Passed!");
}

main().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
