import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  getOverview,
  getFunnel,
  getTrends,
  getBySource
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(authenticate);

router.get('/overview', getOverview);
router.get('/funnel', getFunnel);
router.get('/trends', getTrends);
router.get('/sources', getBySource);

export default router;
