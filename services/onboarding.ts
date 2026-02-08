
// Mock Data
let workflows = [
  {
    id: 'wf-1',
    userId: 'user-1',
    title: 'Senior Frontend Engineer Onboarding',
    status: 'active',
    progress: 20,
    createdAt: new Date().toISOString(),
  }
];

let tasks = [
  {
    id: 'task-1',
    workflowId: 'wf-1',
    title: 'Sign Employment Contract',
    description: 'Review and sign your offer letter and NDA.',
    type: 'document',
    status: 'completed',
    dueDate: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    workflowId: 'wf-1',
    title: 'Order Equipment',
    description: 'Select your laptop and peripherals.',
    type: 'hardware',
    status: 'pending',
    dueDate: new Date().toISOString(),
  },
  {
    id: 'task-3',
    workflowId: 'wf-1',
    title: 'Setup Company Email',
    description: 'Create your Google Workspace account.',
    type: 'task',
    status: 'pending',
    dueDate: new Date().toISOString(),
  },
  {
    id: 'task-4',
    workflowId: 'wf-1',
    title: 'Join Slack Channels',
    description: 'Join #general, #engineering, and #random.',
    type: 'task',
    status: 'pending',
    dueDate: new Date().toISOString(),
  },
  {
    id: 'task-5',
    workflowId: 'wf-1',
    title: 'Complete Security Training',
    description: 'Watch the 15-minute security video.',
    type: 'training',
    status: 'pending',
    dueDate: new Date().toISOString(),
  }
];

export async function getWorkflow(userId: string) {
  return workflows.find(w => w.userId === userId);
}

export async function getTasks(workflowId: string) {
  return tasks.filter(t => t.workflowId === workflowId);
}

export async function completeTask(taskId: string) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    
    // Update workflow progress
    const wf = workflows.find(w => w.id === task.workflowId);
    if (wf) {
        const wfTasks = tasks.filter(t => t.workflowId === wf.id);
        const completed = wfTasks.filter(t => t.status === 'completed').length;
        wf.progress = Math.round((completed / wfTasks.length) * 100);
        if (wf.progress === 100) wf.status = 'completed';
    }
    
    return task;
  }
  return null;
}
