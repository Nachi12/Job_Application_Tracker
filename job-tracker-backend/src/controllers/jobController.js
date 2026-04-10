import { JobApplication } from '../models/JobApplication.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const statusMap = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

// ✅ CREATE JOB
export const createJob = asyncHandler(async (req, res) => {
  try {
    console.log('USER =>', req.user);
    console.log('BODY =>', req.body);

    const userId = req.user?.sub;

    const {
      companyName,
      role,
      jobLink,
      status,
      salary,
      notes,
      appliedDate,
      interviewDate,
      deadlineDate
    } = req.body;

    if (!userId) throw new ApiError(401, 'User not authenticated');
    if (!companyName || !role || !appliedDate) {
      throw new ApiError(400, 'companyName, role, and appliedDate are required');
    }

    const safeStatus =
      statusMap[String(status || '').trim().toUpperCase()] || 'Applied';

    const job = await JobApplication.create({
      userId,
      companyName: String(companyName).trim(),
      role: String(role).trim(),
      jobLink: jobLink || '',
      status: safeStatus,
      salary: Number(salary) || 0,
      notes: notes || '',
      appliedDate: new Date(appliedDate),
      interviewDate: interviewDate ? new Date(interviewDate) : undefined,
      deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined
    });

    await ActivityLog.create({
      userId,
      action: 'created',
      entity: 'job',
      entityId: job._id
    });

    return res.status(201).json(job);
  } catch (err) {
    console.error('🔥 CREATE JOB ERROR:', err);
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  }
});

// ✅ GET ALL JOBS
export const getJobs = asyncHandler(async (req, res) => {
  const userId = req.user.sub;

  const {
    status,
    company,
    page = 1,
    limit = 10
  } = req.query;

  const query = { userId };

  if (status) {
    query.status = status;
  }

  if (company) {
    query.companyName = { $regex: company, $options: 'i' };
  }

  const numericLimit = Math.min(Number(limit) || 10, 100);
  const numericPage = Math.max(Number(page) || 1, 1);

  const [items, total] = await Promise.all([
    JobApplication.find(query)
      .sort({ appliedDate: -1 })
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit),

    JobApplication.countDocuments(query)
  ]);

  res.json({
    data: items,
    meta: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit)
    }
  });
});

// ✅ GET SINGLE JOB
export const getJobById = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;

  const job = await JobApplication.findOne({ _id: id, userId });

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  res.json(job);
});

// ✅ UPDATE JOB
export const updateJob = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;

  const job = await JobApplication.findOneAndUpdate(
    { _id: id, userId },
    req.body,
    { new: true }
  );

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  await ActivityLog.create({
    userId,
    action: 'updated',
    entity: 'job',
    entityId: job._id
  });

  res.json(job);
});

// ✅ DELETE JOB (THIS WAS MISSING 🔥)
export const deleteJob = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;

  const job = await JobApplication.findOneAndDelete({ _id: id, userId });

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  await ActivityLog.create({
    userId,
    action: 'deleted',
    entity: 'job',
    entityId: job._id
  });

  res.status(204).send();
});