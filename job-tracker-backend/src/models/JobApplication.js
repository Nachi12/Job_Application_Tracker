import mongoose from 'mongoose';

const { Schema } = mongoose;

const jobApplicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    companyName: { type: String, required: true, trim: true },

    role: { type: String, required: true, trim: true },

    jobLink: { type: String, trim: true, default: '' },

    companyUrl: { type: String, trim: true, default: '' },

    location: { type: String, trim: true, default: '' },

    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid', 'Other'],
      default: 'Full-time'
    },

    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
      index: true
    },

    source: {
      type: String,
      enum: ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Job Board', 'Other'],
      default: 'LinkedIn'
    },

    salary: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },

    recruiterName: { type: String, trim: true, default: '' },
    recruiterEmail: { type: String, trim: true, default: '' },

    jobDescription: { type: String, default: '' },
    notes: { type: String, trim: true, default: '' },
    coverLetter: { type: String, default: '' },

    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },

    appliedDate: { type: Date, required: true, default: Date.now },
    interviewDate: { type: Date },
    followUpDate: { type: Date },
    deadlineDate: { type: Date },

    tags: [{ type: String, trim: true }],
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
  },
  { timestamps: true }
);

jobApplicationSchema.index({ userId: 1, status: 1 });
jobApplicationSchema.index({ userId: 1, appliedDate: -1 });
jobApplicationSchema.index({ userId: 1, companyName: 1 });
jobApplicationSchema.index({ userId: 1, followUpDate: 1 });

export const JobApplication = mongoose.model(
  'JobApplication',
  jobApplicationSchema
);