import { Resume } from '../models/Resume.js';
import { ApiError } from '../utils/ApiError.js';

export const resumeService = {
  async getResumes(userId) {
    return Resume.find({ userId }).sort({ isPrimary: -1, updatedAt: -1 });
  },

  async createResume(userId, data) {
    const { title, content, skills, isPrimary } = data;
    if (!title || !content) {
      throw new ApiError(400, 'Title and resume content are required.');
    }

    if (isPrimary) {
      await Resume.updateMany({ userId }, { isPrimary: false });
    }

    const count = await Resume.countDocuments({ userId });
    const setAsPrimary = isPrimary || count === 0;

    return Resume.create({
      userId,
      title: title.trim(),
      content,
      skills: Array.isArray(skills) ? skills : [],
      isPrimary: setAsPrimary
    });
  },

  async updateResume(userId, resumeId, data) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) throw new ApiError(404, 'Resume not found');

    if (data.isPrimary) {
      await Resume.updateMany({ userId }, { isPrimary: false });
    }

    return Resume.findOneAndUpdate({ _id: resumeId, userId }, { $set: data }, { new: true });
  },

  async deleteResume(userId, resumeId) {
    const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });
    if (!resume) throw new ApiError(404, 'Resume not found');
    return true;
  }
};
