export type JobStatus = 'Saved' | 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  _id: string;
  id?: string;
  userId?: string;
  companyName: string;
  role: string;
  jobLink?: string;
  companyUrl?: string;
  location?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote' | 'Hybrid' | 'Other';
  status: JobStatus;
  source?: 'LinkedIn' | 'Indeed' | 'Company Website' | 'Referral' | 'Job Board' | 'Other';
  salary?: number;
  salaryMax?: number;
  currency?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  jobDescription?: string;
  notes?: string;
  coverLetter?: string;
  resumeId?: string;
  appliedDate: string; // ISO string
  interviewDate?: string;
  followUpDate?: string;
  deadlineDate?: string;
  tags?: string[];
  priority?: 'Low' | 'Medium' | 'High';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationEvent {
  _id: string;
  applicationId: string;
  type: string;
  title: string;
  description?: string;
  eventDate: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  content: string;
  skills: string[];
  isPrimary: boolean;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reminder {
  _id: string;
  applicationId?: any;
  title: string;
  type: 'follow_up' | 'interview' | 'inactivity' | 'custom';
  dueDate: string;
  status: 'pending' | 'completed' | 'snoozed';
  notes?: string;
}

export interface JobAnalysisResult {
  role: string;
  company: string;
  experienceRequired: string;
  educationRequired: string;
  requiredSkills: string[];
  preferredSkills: string[];
  softSkills: string[];
  technologies: string[];
  keyResponsibilities: string[];
  salaryMentioned: string;
  summary: string;
  isFallback?: boolean;
}

export interface MatchScoreResult {
  overallMatch: number;
  technicalScore: number;
  experienceScore: number;
  educationScore: number;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  isFallback?: boolean;
}

export interface CoverLetterResult {
  subjectLine: string;
  salutation: string;
  bodyParagraphs: string[];
  closing: string;
  isFallback?: boolean;
}

export interface RecruiterMessageResult {
  linkedInMsg: string;
  recruiterEmailMsg: string;
  referralMsg: string;
  isFallback?: boolean;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'Behavioral' | 'System Design';
  question: string;
  guidance: string;
  keyTopics: string[];
}

export type SubscriptionPlan = 'FREE' | 'PRO';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  subscriptionPlan: SubscriptionPlan;
  createdAt?: string;
}