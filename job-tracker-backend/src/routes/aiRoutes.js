import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import {
  analyzeJob,
  evaluateMatch,
  tailorResume,
  generateCoverLetter,
  generateRecruiterMessage,
  generateInterviewPrep,
  evaluateMockAnswer
} from '../controllers/aiController.js';

const router = express.Router();

router.use(authenticate);
router.use(aiLimiter);

router.post('/analyze-job', analyzeJob);
router.post('/evaluate-match', evaluateMatch);
router.post('/tailor-resume', tailorResume);
router.post('/cover-letter', generateCoverLetter);
router.post('/recruiter-message', generateRecruiterMessage);
router.post('/interview-prep', generateInterviewPrep);
router.post('/mock-interview/evaluate', evaluateMockAnswer);

export default router;
