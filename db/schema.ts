import { pgTable, text, timestamp, boolean, jsonb, integer, serial, uuid, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').default('employee'), // 'employee', 'manager', 'admin'
  jobTitle: text('job_title'),
  avatarUrl: text('avatar_url'),
  managerId: uuid('manager_id'), // Self-reference for hierarchy
  preferences: jsonb('preferences').default({}),
  createdAt: timestamp('created_at').defaultNow(),
});

export const actionItems = pgTable('action_items', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(), // 'approval', 'review', 'survey'
  payload: jsonb('payload').notNull(),
  urgencyScore: integer('urgency_score').default(0),
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected'
  createdAt: timestamp('created_at').defaultNow(),
});

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('in_progress'), // 'not_started', 'in_progress', 'completed'
  progress: integer('progress').default(0), // 0-100
  dueDate: date('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const keyResults = pgTable('key_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  goalId: uuid('goal_id').references(() => goals.id),
  title: text('title').notNull(),
  currentValue: integer('current_value').default(0),
  targetValue: integer('target_value').notNull(),
  unit: text('unit').default('number'), // 'number', 'percent', 'currency'
});

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  fromUserId: uuid('from_user_id').references(() => users.id),
  toUserId: uuid('to_user_id').references(() => users.id),
  content: text('content').notNull(),
  sentimentScore: integer('sentiment_score'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const timeOffRequests = pgTable('time_off_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  type: text('type').notNull(), // 'vacation', 'sick', 'personal'
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected'
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  amount: integer('amount').notNull(), // cents
  category: text('category').notNull(), // 'travel', 'meals', 'supplies'
  merchant: text('merchant').notNull(),
  description: text('description'),
  receiptUrl: text('receipt_url'),
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected'
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviewCycles = pgTable('review_cycles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(), // e.g., "Q1 2024 Performance Review"
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  status: text('status').default('draft'), // 'draft', 'active', 'closed'
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  cycleId: uuid('cycle_id').references(() => reviewCycles.id),
  reviewerId: uuid('reviewer_id').references(() => users.id),
  revieweeId: uuid('reviewee_id').references(() => users.id),
  type: text('type').notNull(), // 'self', 'manager', 'peer'
  status: text('status').default('pending'), // 'pending', 'completed'
  content: jsonb('content'), // { strengths: "", improvements: "", rating: 5 }
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const jobPostings = pgTable('job_postings', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  description: text('description').notNull(),
  status: text('status').default('draft'), // 'draft', 'open', 'closed'
  requirements: jsonb('requirements'), // List of skills/requirements
  createdAt: timestamp('created_at').defaultNow(),
});

export const candidates = pgTable('candidates', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => jobPostings.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  resumeUrl: text('resume_url'),
  stage: text('stage').default('applied'), // 'applied', 'screening', 'interview', 'offer', 'hired', 'rejected'
  aiScore: integer('ai_score'), // 0-100
  aiSummary: text('ai_summary'),
  appliedAt: timestamp('applied_at').defaultNow(),
});

export const compensation = pgTable('compensation', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  amount: integer('amount').notNull(), // Annual cents
  currency: text('currency').default('USD'),
  effectiveDate: date('effective_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const payslips = pgTable('payslips', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  grossPay: integer('gross_pay').notNull(),
  netPay: integer('net_pay').notNull(),
  deductions: jsonb('deductions'), // { tax: 100, 401k: 50 }
  status: text('status').default('paid'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const onboardingWorkflows = pgTable('onboarding_workflows', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(), // e.g., "Engineering Onboarding"
  status: text('status').default('active'), // 'active', 'completed'
  progress: integer('progress').default(0), // 0-100
  createdAt: timestamp('created_at').defaultNow(),
});

export const onboardingTasks = pgTable('onboarding_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  workflowId: uuid('workflow_id').references(() => onboardingWorkflows.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').default('task'), // 'task', 'document', 'hardware'
  status: text('status').default('pending'), // 'pending', 'completed'
  assignedTo: uuid('assigned_to'), // If it's an IT task, assigned to IT admin
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
});

export const benefitPlans = pgTable('benefit_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // "Gold Health PPO"
  type: text('type').notNull(), // "medical", "dental", "vision"
  provider: text('provider').notNull(),
  costEmployee: integer('cost_employee').notNull(), // Monthly cents
  costEmployer: integer('cost_employer').notNull(),
  description: text('description'),
});

export const benefitEnrollments = pgTable('benefit_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  planId: uuid('plan_id').references(() => benefitPlans.id),
  status: text('status').default('active'),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
});

export const lifecycleEvents = pgTable('lifecycle_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(), // 'hire', 'promote', 'transfer', 'terminate'
  previousValue: jsonb('previous_value'),
  newValue: jsonb('new_value'),
  effectiveDate: date('effective_date').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow(),
});
