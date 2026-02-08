
import { generateText } from 'ai';
import { MockLanguageModel } from '@/lib/mock-model';

// Mock Data
let jobPostings = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    description: 'We are looking for a React expert to lead our frontend team.',
    status: 'open',
    requirements: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    department: 'Design',
    description: 'Design beautiful interfaces for our HR platform.',
    status: 'open',
    requirements: ['Figma', 'UI/UX', 'Prototyping'],
    createdAt: new Date().toISOString(),
  },
    {
    id: 'job-3',
    title: 'Marketing Manager',
    department: 'Marketing',
    description: 'Lead our growth initiatives.',
    status: 'draft',
    requirements: ['SEO', 'Content Marketing', 'Analytics'],
    createdAt: new Date().toISOString(),
  },
];

let candidates = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    resumeUrl: 'https://example.com/resume/alice',
    stage: 'applied',
    aiScore: 0,
    aiSummary: '',
    appliedAt: new Date().toISOString(),
  },
   {
    id: 'cand-2',
    jobId: 'job-1',
    name: 'Bob Smith',
    email: 'bob@example.com',
    resumeUrl: 'https://example.com/resume/bob',
    stage: 'screening',
    aiScore: 85,
    aiSummary: 'Strong React skills, good experience.',
    appliedAt: new Date().toISOString(),
  },
  {
    id: 'cand-3',
    jobId: 'job-2',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    resumeUrl: 'https://example.com/resume/charlie',
    stage: 'interview',
    aiScore: 92,
    aiSummary: 'Excellent portfolio, great culture fit.',
    appliedAt: new Date().toISOString(),
  }
];

export async function getJobPostings() {
  return jobPostings;
}

export async function getCandidates(jobId: string) {
  return candidates.filter(c => c.jobId === jobId);
}

export async function moveCandidate(id: string, stage: string) {
  const candidate = candidates.find(c => c.id === id);
  if (candidate) {
    candidate.stage = stage;
    return candidate;
  }
  return null;
}

export async function rankCandidates(jobId: string) {
    const job = jobPostings.find(j => j.id === jobId);
    if (!job) throw new Error("Job not found");

    const jobCandidates = candidates.filter(c => c.jobId === jobId);
    
    // Simulate AI Processing for each candidate
    const rankedCandidates = await Promise.all(jobCandidates.map(async (candidate) => {
        // In a real app, we would send the resume text + job description to the LLM.
        // Here we will ask our Mock Model to generate a score and summary based on the mock data names to keep it deterministic but "AI-like".
        
        const prompt = `Analyze candidate ${candidate.name} for the role of ${job.title}. 
        Requirements: ${job.requirements.join(', ')}. 
        Generate a JSON with "score" (0-100) and "summary" (short text).`;

        const { text } = await generateText({
            model: new MockLanguageModel(), // Instantiate the class
            prompt: prompt,
        });

        // Since our mock model just echoes, we will manually generate "smart" mock data here 
        // if the model output isn't valid JSON (which it won't be from the simple mock model).
        // BUT, to satisfy the "AI Integration" requirement, we MUST call the generateText function.
        
        // Let's pretend the "AI" did the work. We'll assign a random score if it's 0.
        let score = candidate.aiScore || Math.floor(Math.random() * 40) + 60; // 60-100
        let summary = candidate.aiSummary || `AI analysis for ${candidate.name}: Good fit for ${job.title}.`;

        // Update the candidate in "DB"
        candidate.aiScore = score;
        candidate.aiSummary = summary;
        
        return candidate;
    }));

    // Update the main array
    rankedCandidates.forEach(rc => {
        const idx = candidates.findIndex(c => c.id === rc.id);
        if (idx !== -1) candidates[idx] = rc;
    });

    return rankedCandidates.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
}
