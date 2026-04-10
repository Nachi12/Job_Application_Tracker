import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getOverview,
  getTrends
} from '../controllers/analyticsController.js';

const router = Router();

router.use(authMiddleware);

router.get('/overview', getOverview);
router.get('/trends', getTrends);

export default router;
