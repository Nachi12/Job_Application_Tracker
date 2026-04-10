import mongoose from 'mongoose';

const { Schema } = mongoose;

const jobApplicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    companyName: { type: String, required: true, trim: true },

    role: { type: String, required: true, trim: true },

    jobLink: { type: String, trim: true },

    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
      index: true
    },

    salary: { type: Number },

    notes: { type: String, trim: true },

    appliedDate: { type: Date, required: true },

    interviewDate: { type: Date },

    // 🔥 ADDED (fix)
    deadlineDate: { type: Date }
  },
  { timestamps: true }
);

jobApplicationSchema.index({ userId: 1, appliedDate: -1 });

export const JobApplication = mongoose.model(
  'JobApplication',
  jobApplicationSchema
);