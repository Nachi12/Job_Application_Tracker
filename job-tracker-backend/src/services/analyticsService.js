import mongoose from 'mongoose';
import { JobApplication } from '../models/JobApplication.js';

export const analyticsService = {
  async getOverview(userId) {
    const userObjId = new mongoose.Types.ObjectId(userId);

    const aggregations = await JobApplication.aggregate([
      { $match: { userId: userObjId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      total: 0,
      Saved: 0,
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    aggregations.forEach((a) => {
      if (counts.hasOwnProperty(a._id)) {
        counts[a._id] = a.count;
      }
      counts.total += a.count;
    });

    const activeApplications = counts.Applied + counts.Screening + counts.Interview;
    const totalResponses = counts.Screening + counts.Interview + counts.Offer + counts.Rejected;
    const responseRate = counts.total > 0 ? Math.round((totalResponses / counts.total) * 100) : 0;
    const interviewRate = counts.total > 0 ? Math.round(((counts.Interview + counts.Offer) / counts.total) * 100) : 0;
    const offerRate = counts.total > 0 ? Math.round((counts.Offer / counts.total) * 100) : 0;

    return {
      totalApplications: counts.total,
      saved: counts.Saved,
      applied: counts.Applied,
      screening: counts.Screening,
      interviews: counts.Interview,
      offers: counts.Offer,
      rejections: counts.Rejected,
      activeApplications,
      responseRate,
      interviewRate,
      offerRate
    };
  },

  async getFunnel(userId) {
    const userObjId = new mongoose.Types.ObjectId(userId);

    const jobs = await JobApplication.find({ userId: userObjId });
    const total = jobs.length;

    const savedCount = jobs.filter((j) => ['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].includes(j.status)).length;
    const appliedCount = jobs.filter((j) => ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].includes(j.status)).length;
    const responseCount = jobs.filter((j) => ['Screening', 'Interview', 'Offer', 'Rejected'].includes(j.status)).length;
    const interviewCount = jobs.filter((j) => ['Interview', 'Offer'].includes(j.status)).length;
    const offerCount = jobs.filter((j) => j.status === 'Offer').length;

    return [
      { stage: 'Saved', count: savedCount, conversionRate: 100 },
      { stage: 'Applied', count: appliedCount, conversionRate: savedCount > 0 ? Math.round((appliedCount / savedCount) * 100) : 0 },
      { stage: 'Screening/Response', count: responseCount, conversionRate: appliedCount > 0 ? Math.round((responseCount / appliedCount) * 100) : 0 },
      { stage: 'Interview', count: interviewCount, conversionRate: responseCount > 0 ? Math.round((interviewCount / responseCount) * 100) : 0 },
      { stage: 'Offer', count: offerCount, conversionRate: interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0 }
    ];
  },

  async getTrends(userId) {
    const userObjId = new mongoose.Types.ObjectId(userId);

    const trends = await JobApplication.aggregate([
      { $match: { userId: userObjId } },
      {
        $group: {
          _id: {
            year: { $year: '$appliedDate' },
            month: { $month: '$appliedDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const data = trends.map((t) => ({
      year: t._id.year,
      month: t._id.month,
      applications: t.count
    }));

    return { data };
  },

  async getBySource(userId) {
    const userObjId = new mongoose.Types.ObjectId(userId);

    const sources = await JobApplication.aggregate([
      { $match: { userId: userObjId } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    return sources.map((s) => ({
      source: s._id || 'LinkedIn',
      count: s.count
    }));
  }
};
