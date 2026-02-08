
// Mock Data
let compensations = [
  {
    id: 'comp-1',
    userId: 'user-1', // Assuming current user
    amount: 15000000, // $150,000.00
    currency: 'USD',
    effectiveDate: '2024-01-01',
    createdAt: new Date().toISOString(),
  }
];

let payslips = [
  {
    id: 'pay-1',
    userId: 'user-1',
    periodStart: '2024-03-01',
    periodEnd: '2024-03-15',
    grossPay: 625000, // $6,250.00
    netPay: 450000, // $4,500.00
    deductions: { tax: 125000, benefit: 50000 },
    status: 'paid',
    paidAt: '2024-03-15T00:00:00Z',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pay-2',
    userId: 'user-1',
    periodStart: '2024-02-15',
    periodEnd: '2024-02-29',
    grossPay: 625000,
    netPay: 450000,
    deductions: { tax: 125000, benefit: 50000 },
    status: 'paid',
    paidAt: '2024-02-29T00:00:00Z',
    createdAt: new Date().toISOString(),
  }
];

export async function getCompensation(userId: string) {
  // Return latest
  return compensations.filter(c => c.userId === userId).sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))[0];
}

export async function getPayslips(userId: string) {
  return payslips.filter(p => p.userId === userId).sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));
}

export async function getLatestPayslip(userId: string) {
  const slips = await getPayslips(userId);
  return slips[0];
}
