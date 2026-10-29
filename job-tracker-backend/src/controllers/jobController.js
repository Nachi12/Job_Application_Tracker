import { jobService } from '../services/jobService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createJob = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const job = await jobService.createJob(userId, req.body);
  res.status(201).json(job);
});

export const getJobs = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const result = await jobService.getJobs(userId, req.query);
  res.json(result);
});

export const getJobById = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  const result = await jobService.getJobById(userId, id);
  res.json(result);
});

export const updateJob = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  const job = await jobService.updateJob(userId, id, req.body);
  res.json(job);
});

export const deleteJob = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  await jobService.deleteJob(userId, id);
  res.status(204).send();
});