
// Mock Data
let plans = [
  {
    id: 'plan-1',
    name: 'Aetna Gold PPO',
    type: 'medical',
    provider: 'Aetna',
    costEmployee: 15000, // $150.00
    costEmployer: 60000, // $600.00
    description: 'Comprehensive coverage with low deductible.',
  },
  {
    id: 'plan-2',
    name: 'BlueCross Silver HMO',
    type: 'medical',
    provider: 'BlueCross',
    costEmployee: 8000, // $80.00
    costEmployer: 40000, // $400.00
    description: 'Network-only plan with lower premiums.',
  },
  {
    id: 'plan-3',
    name: 'Delta Dental Premier',
    type: 'dental',
    provider: 'Delta Dental',
    costEmployee: 1500, // $15.00
    costEmployer: 3000, // $30.00
    description: 'Includes orthodontics and major procedures.',
  },
  {
    id: 'plan-4',
    name: 'VSP Vision Choice',
    type: 'vision',
    provider: 'VSP',
    costEmployee: 500, // $5.00
    costEmployer: 1500, // $15.00
    description: 'Annual eye exam and glasses/contacts allowance.',
  }
];

let enrollments: any[] = [
  // User starts with no enrollments
];

export async function getPlans() {
  return plans;
}

export async function getEnrollments(userId: string) {
  return enrollments.filter(e => e.userId === userId);
}

export async function enrollInPlan(userId: string, planId: string) {
  // Check if already enrolled in type
  const plan = plans.find(p => p.id === planId);
  if (!plan) throw new Error("Plan not found");

  // Remove existing enrollment for same type
  enrollments = enrollments.filter(e => {
     if (e.userId !== userId) return true;
     const enrolledPlan = plans.find(p => p.id === e.planId);
     return enrolledPlan?.type !== plan.type;
  });

  const newEnrollment = {
    id: crypto.randomUUID(),
    userId,
    planId,
    status: 'active',
    enrolledAt: new Date().toISOString(),
  };
  
  enrollments.push(newEnrollment);
  return newEnrollment;
}
