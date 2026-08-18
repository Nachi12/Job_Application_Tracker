import { analyticsService } from '../services/analyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const overview = await analyticsService.getOverview(userId);
  res.json(overview);
});

export const getFunnel = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const funnel = await analyticsService.getFunnel(userId);
  res.json({ funnel });
});

export const getTrends = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const trends = await analyticsService.getTrends(userId);
  res.json(trends);
});

export const getBySource = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const sources = await analyticsService.getBySource(userId);
  res.json({ sources });
});
