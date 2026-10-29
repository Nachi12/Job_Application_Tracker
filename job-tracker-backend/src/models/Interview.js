import mongoose from 'mongoose';

const { Schema } = mongoose;

const interviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'JobApplication', required: true, index: true },
    round: { type: String, required: true }, // Recruiter Screen, Technical, System Design, Behavioral, Final
    scheduledAt: { type: Date, required: true },
    interviewers: [{ type: String }],
    meetingLink: { type: String, default: '' },
    notes: { type: String, default: '' },
    questions: [
      {
        question: String,
        category: String, // technical, behavioral, system_design
        userAnswer: String,
        feedback: String
      }
    ],
    mockFeedback: {
      clarityScore: Number,
      technicalScore: Number,
      structureScore: Number,
      overallScore: Number,
      summary: String,
      keyImprovements: [String]
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  },
  { timestamps: true }
);

interviewSchema.index({ userId: 1, scheduledAt: 1 });

export const Interview = mongoose.model('Interview', interviewSchema);
