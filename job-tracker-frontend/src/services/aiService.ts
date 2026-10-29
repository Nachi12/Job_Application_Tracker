import apiClient from './apiClient';
import {
  JobAnalysisResult,
  MatchScoreResult,
  CoverLetterResult,
  RecruiterMessageResult,
  InterviewQuestion
} from '../types/models';

export const aiService = {
  async analyzeJob(jobDescription: string): Promise<JobAnalysisResult> {
    const res = await apiClient.post('/ai/analyze-job', { jobDescription });
    return res.data;
  },

  async evaluateMatch(jobDescription: string, resumeId?: string): Promise<MatchScoreResult> {
    const res = await apiClient.post('/ai/evaluate-match', { jobDescription, resumeId });
    return res.data;
  },

  async tailorResume(jobDescription: string, resumeContent?: string, resumeId?: string) {
    const res = await apiClient.post('/ai/tailor-resume', { jobDescription, resumeContent, resumeId });
    return res.data;
  },

  async generateCoverLetter(payload: { jobDescription?: string; companyName: string; role: string; applicationId?: string }): Promise<CoverLetterResult> {
    const res = await apiClient.post('/ai/cover-letter', payload);
    return res.data;
  },

  async generateRecruiterMessage(payload: { role: string; companyName: string; recruiterName?: string }): Promise<RecruiterMessageResult> {
    const res = await apiClient.post('/ai/recruiter-message', payload);
    return res.data;
  },

  async generateInterviewPrep(role: string, jobDescription?: string): Promise<{ questions: InterviewQuestion[]; isFallback?: boolean }> {
    const res = await apiClient.post('/ai/interview-prep', { role, jobDescription });
    return res.data;
  },

  async evaluateMockAnswer(question: string, userAnswer: string, category: string) {
    const res = await apiClient.post('/ai/mock-interview/evaluate', { question, userAnswer, category });
    return res.data;
  }
};
