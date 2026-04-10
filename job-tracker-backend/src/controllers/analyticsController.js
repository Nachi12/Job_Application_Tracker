import mongoose from 'mongoose';
import { JobApplication } from '../models/JobApplication.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverview = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

  const aggregations = await JobApplication.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const counts = { total: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  aggregations.forEach((a) => {
    counts[a._id] = a.count;
    counts.total += a.count;
  });

  res.json({
    totalApplications: counts.total,
    interviews: counts.Interview,
    offers: counts.Offer,
    rejections: counts.Rejected
  });
});

export const getTrends = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const trends = await JobApplication.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: {
          year: { $year: '$appliedDate' },
          month: { $month: '$appliedDate' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1
      }
    }
  ]);

  const data = trends.map((t) => ({
    year: t._id.year,
    month: t._id.month,
    applications: t.count
  }));

  res.json({ data });
});
