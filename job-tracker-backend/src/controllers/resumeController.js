import { resumeService } from '../services/resumeService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getResumes = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const resumes = await resumeService.getResumes(userId);
  res.json(resumes);
});

export const createResume = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const resume = await resumeService.createResume(userId, req.body);
  res.status(201).json(resume);
});

export const updateResume = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  const resume = await resumeService.updateResume(userId, id, req.body);
  res.json(resume);
});

export const deleteResume = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  await resumeService.deleteResume(userId, id);
  res.status(204).send();
});
