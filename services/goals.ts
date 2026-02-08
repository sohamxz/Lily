
// Mock Data
let goals: any[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Ship FlowState MVP',
    description: 'Launch the initial version with core HR features.',
    status: 'in_progress',
    progress: 80,
    dueDate: '2024-04-01',
    createdAt: new Date().toISOString(),
  }
];

let keyResults: any[] = [
  {
    id: 'kr-1',
    goalId: 'goal-1',
    title: 'Implement 10 Core Features',
    currentValue: 8,
    targetValue: 10,
    unit: 'number'
  }
];

export async function getGoals(userId: string) {
  const userGoals = goals.filter(g => g.userId === userId);
  // Attach key results
  return userGoals.map(g => ({
      ...g,
      keyResults: keyResults.filter(kr => kr.goalId === g.id)
  }));
}

export async function createGoal(userId: string, data: any) {
  const newGoal = {
    id: crypto.randomUUID(),
    userId,
    title: data.title,
    description: data.description,
    status: 'not_started',
    progress: 0,
    dueDate: data.dueDate,
    createdAt: new Date().toISOString(),
  };
  goals.push(newGoal);
  
  if (data.keyResults) {
      data.keyResults.forEach((kr: any) => {
          keyResults.push({
              id: crypto.randomUUID(),
              goalId: newGoal.id,
              ...kr
          });
      });
  }
  
  return {
      ...newGoal,
      keyResults: keyResults.filter(kr => kr.goalId === newGoal.id)
  };
}

export async function updateKeyResult(krId: string, value: number) {
    const kr = keyResults.find(k => k.id === krId);
    if (kr) {
        kr.currentValue = value;
        // Recalculate goal progress
        const goal = goals.find(g => g.id === kr.goalId);
        if (goal) {
             const goalKRs = keyResults.filter(k => k.goalId === goal.id);
             let totalProgress = 0;
             goalKRs.forEach(k => {
                 totalProgress += (k.currentValue / k.targetValue);
             });
             goal.progress = Math.min(Math.round((totalProgress / goalKRs.length) * 100), 100);
             if (goal.progress === 100) goal.status = 'completed';
        }
        return kr;
    }
    return null;
}
