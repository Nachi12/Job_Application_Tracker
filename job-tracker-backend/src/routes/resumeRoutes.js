import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getResumes,
  createResume,
  updateResume,
  deleteResume
} from '../controllers/resumeController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getResumes);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
