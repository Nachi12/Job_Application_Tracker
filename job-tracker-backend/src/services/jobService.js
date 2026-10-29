import { JobApplication } from '../models/JobApplication.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { ApplicationEvent } from '../models/ApplicationEvent.js';
import { ApiError } from '../utils/ApiError.js';

const statusMap = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

export const jobService = {
  async createJob(userId, data) {
    if (!userId) throw new ApiError(401, 'User not authenticated');

    const {
      companyName,
      role,
      jobLink,
      companyUrl,
      location,
      employmentType,
      status,
      source,
      salary,
      salaryMax,
      currency,
      recruiterName,
      recruiterEmail,
      jobDescription,
      notes,
      resumeId,
      appliedDate,
      interviewDate,
      followUpDate,
      deadlineDate,
      tags,
      priority
    } = data;

    if (!companyName || !role) {
      throw new ApiError(400, 'Company name and role are required');
    }

    const rawStatus = String(status || '').trim().toUpperCase();
    const safeStatus = statusMap[rawStatus] || (Object.values(statusMap).includes(status) ? status : 'Applied');

    const job = await JobApplication.create({
      userId,
      companyName: String(companyName).trim(),
      role: String(role).trim(),
      jobLink: jobLink || '',
      companyUrl: companyUrl || '',
      location: location || '',
      employmentType: employmentType || 'Full-time',
      status: safeStatus,
      source: source || 'LinkedIn',
      salary: Number(salary) || 0,
      salaryMax: Number(salaryMax) || 0,
      currency: currency || 'USD',
      recruiterName: recruiterName || '',
      recruiterEmail: recruiterEmail || '',
      jobDescription: jobDescription || '',
      notes: notes || '',
      resumeId: resumeId || undefined,
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      interviewDate: interviewDate ? new Date(interviewDate) : undefined,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
      tags: Array.isArray(tags) ? tags : [],
      priority: priority || 'Medium'
    });

    await ActivityLog.create({
      userId,
      action: 'created',
      entity: 'job',
      entityId: job._id
    });

    await ApplicationEvent.create({
      userId,
      applicationId: job._id,
      type: 'status_change',
      title: 'Application Created',
      description: `Added application for ${job.role} at ${job.companyName} with status ${job.status}`
    });

    return job;
  },

  async getJobs(userId, filters = {}) {
    const { status, company, search, source, page = 1, limit = 20, sortBy = 'appliedDate', sortDir = 'desc' } = filters;

    const query = { userId };

    if (status && status !== 'ALL') {
      const rawStatus = String(status).toUpperCase();
      query.status = statusMap[rawStatus] || status;
    }

    if (company) {
      query.companyName = { $regex: company, $options: 'i' };
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const numericLimit = Math.min(Number(limit) || 20, 100);
    const numericPage = Math.max(Number(page) || 1, 1);
    const sortOrder = sortDir === 'asc' ? 1 : -1;
    const sortObj = { [sortBy === 'dateApplied' ? 'appliedDate' : sortBy]: sortOrder };

    const [items, total] = await Promise.all([
      JobApplication.find(query)
        .sort(sortObj)
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      JobApplication.countDocuments(query)
    ]);

    return {
      data: items,
      meta: {
        total,
        page: numericPage,
        limit: numericLimit,
        totalPages: Math.ceil(total / numericLimit)
      }
    };
  },

  async getJobById(userId, jobId) {
    const job = await JobApplication.findOne({ _id: jobId, userId }).populate('resumeId');
    if (!job) {
      throw new ApiError(404, 'Application not found');
    }

    const events = await ApplicationEvent.find({ applicationId: jobId }).sort({ eventDate: -1 });

    return { job, events };
  },

  async updateJob(userId, jobId, updateData) {
    const oldJob = await JobApplication.findOne({ _id: jobId, userId });
    if (!oldJob) {
      throw new ApiError(404, 'Application not found');
    }

    if (updateData.status) {
      const rawStatus = String(updateData.status).toUpperCase();
      updateData.status = statusMap[rawStatus] || updateData.status;
    }

    const updatedJob = await JobApplication.findOneAndUpdate(
      { _id: jobId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (oldJob.status !== updatedJob.status) {
      await ApplicationEvent.create({
        userId,
        applicationId: jobId,
        type: 'status_change',
        title: `Status Changed to ${updatedJob.status}`,
        description: `Moved from ${oldJob.status} to ${updatedJob.status}`
      });
    }

    await ActivityLog.create({
      userId,
      action: 'updated',
      entity: 'job',
      entityId: jobId
    });

    return updatedJob;
  },

  async deleteJob(userId, jobId) {
    const job = await JobApplication.findOneAndDelete({ _id: jobId, userId });
    if (!job) {
      throw new ApiError(404, 'Application not found');
    }

    await ActivityLog.create({
      userId,
      action: 'deleted',
      entity: 'job',
      entityId: jobId
    });

    await ApplicationEvent.deleteMany({ applicationId: jobId });

    return true;
  }
};
