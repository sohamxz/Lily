
// Mock Data
let expenses: any[] = [
  {
    id: 'exp-1',
    userId: 'user-1',
    amount: 4500, // $45.00
    category: 'meals',
    merchant: 'Starbucks',
    description: 'Team coffee',
    receiptUrl: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    userId: 'user-1',
    amount: 12000, // $120.00
    category: 'travel',
    merchant: 'Uber',
    description: 'Airport ride',
    receiptUrl: '',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export async function getExpenses(userId: string) {
  return expenses.filter(e => e.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createExpense(userId: string, data: any) {
  const newExpense = {
    id: crypto.randomUUID(),
    userId,
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  expenses.push(newExpense);
  return newExpense;
}

export async function approveExpense(expenseId: string) {
  const expense = expenses.find(e => e.id === expenseId);
  if (expense) {
    expense.status = 'approved';
    return expense;
  }
  return null;
}

export async function rejectExpense(expenseId: string) {
  const expense = expenses.find(e => e.id === expenseId);
  if (expense) {
    expense.status = 'rejected';
    return expense;
  }
  return null;
}
