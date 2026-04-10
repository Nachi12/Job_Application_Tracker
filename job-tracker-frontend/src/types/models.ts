export type JobStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  jobLink: string;
  status: JobStatus;
  salary?: number;
  notes?: string;
  dateApplied: string; // ISO date
  interviewDate?: string; // ISO
  deadlineDate?: string; // ISO
}

export type SubscriptionPlan = 'FREE' | 'PRO';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  avatarUrl?: string;
}