import { aiService } from '../services/aiService.js';
import { Resume } from '../models/Resume.js';
import { JobApplication } from '../models/JobApplication.js';
import { AIAnalysis } from '../models/AIAnalysis.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const analyzeJob = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;
  if (!jobDescription) throw new ApiError(400, 'Job description is required.');

  const analysis = await aiService.analyzeJobDescription(jobDescription);

  if (req.user?.sub) {
    await AIAnalysis.create({
      userId: req.user.sub,
      type: 'job_analysis',
      result: analysis
    });
  }

  res.json(analysis);
});

export const evaluateMatch = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { jobDescription, resumeId } = req.body;

  if (!jobDescription) throw new ApiError(400, 'Job description is required.');

  let userSkills = [];
  let resumeContent = '';

  if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (resume) {
      userSkills = resume.skills || [];
      resumeContent = resume.content || '';
    }
  } else {
    const primaryResume = await Resume.findOne({ userId, isPrimary: true });
    if (primaryResume) {
      userSkills = primaryResume.skills || [];
      resumeContent = primaryResume.content || '';
    }
  }

  const result = await aiService.evaluateJobMatch(jobDescription, userSkills, resumeContent);

  await AIAnalysis.create({
    userId,
    type: 'match_score',
    result
  });

  res.json(result);
});

export const tailorResume = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { jobDescription, resumeId } = req.body;

  if (!jobDescription) throw new ApiError(400, 'Job description is required.');

  let resumeContent = req.body.resumeContent || '';
  if (!resumeContent && resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (resume) resumeContent = resume.content;
  }

  if (!resumeContent) {
    const primary = await Resume.findOne({ userId, isPrimary: true });
    if (primary) resumeContent = primary.content;
  }

  if (!resumeContent) {
    throw new ApiError(400, 'Resume content or valid resume ID is required.');
  }

  const result = await aiService.tailorResume(jobDescription, resumeContent);
  res.json(result);
});

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { jobDescription, companyName, role, applicationId } = req.body;

  let comp = companyName;
  let jobRole = role;
  let jobDesc = jobDescription;

  if (applicationId) {
    const app = await JobApplication.findOne({ _id: applicationId, userId });
    if (app) {
      comp = comp || app.companyName;
      jobRole = jobRole || app.role;
      jobDesc = jobDesc || app.jobDescription;
    }
  }

  if (!comp || !jobRole) {
    throw new ApiError(400, 'Company name and role are required.');
  }

  const primaryResume = await Resume.findOne({ userId, isPrimary: true });
  const userProfile = { name: req.user.email ? req.user.email.split('@')[0] : 'Applicant', skills: primaryResume?.skills || [] };

  const result = await aiService.generateCoverLetter({
    jobDescription: jobDesc || `${jobRole} position at ${comp}`,
    userProfile,
    companyName: comp,
    role: jobRole
  });

  res.json(result);
});

export const generateRecruiterMessage = asyncHandler(async (req, res) => {
  const { role, companyName, recruiterName } = req.body;
  if (!role || !companyName) {
    throw new ApiError(400, 'Role and company name are required.');
  }

  const result = await aiService.generateRecruiterMessage({ role, companyName, recruiterName });
  res.json(result);
});

export const generateInterviewPrep = asyncHandler(async (req, res) => {
  const { jobDescription, role } = req.body;
  if (!role) throw new ApiError(400, 'Role is required.');

  const result = await aiService.generateInterviewPrep(jobDescription || '', role);
  res.json(result);
});

export const evaluateMockAnswer = asyncHandler(async (req, res) => {
  const { question, userAnswer, category } = req.body;
  if (!question || !userAnswer) {
    throw new ApiError(400, 'Question and user answer are required.');
  }

  const result = await aiService.evaluateMockInterviewAnswer(question, userAnswer, category || 'Technical');
  res.json(result);
});
