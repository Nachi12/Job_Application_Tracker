import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';

const router = Router();

// 🔐 Apply auth middleware to all routes
router.use(authMiddleware);

// 🚀 CREATE + GET ALL
// Base route → /api/jobs
router.route('/')
  .post(createJob)   // POST /api/jobs
  .get(getJobs);     // GET /api/jobs

// 🔍 GET ONE + UPDATE + DELETE
router.route('/:id')
  .get(getJobById)    // GET /api/jobs/:id
  .put(updateJob)     // PUT /api/jobs/:id
  .delete(deleteJob); // DELETE /api/jobs/:id

export default router;