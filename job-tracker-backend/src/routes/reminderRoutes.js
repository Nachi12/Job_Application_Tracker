import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getReminders,
  createReminder,
  updateStatus,
  deleteReminder
} from '../controllers/reminderController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getReminders);
router.post('/', createReminder);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteReminder);

export default router;
