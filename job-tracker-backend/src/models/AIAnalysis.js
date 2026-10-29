import mongoose from 'mongoose';

const { Schema } = mongoose;

const aiAnalysisSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'JobApplication', index: true },

    type: {
      type: String,
      enum: ['job_analysis', 'match_score', 'skill_gap', 'tailor_resume', 'cover_letter', 'recruiter_message', 'interview_prep', 'mock_interview'],
      required: true
    },

    inputHash: { type: String }, // cached MD5/SHA hash of input to prevent duplicate LLM calls

    result: { type: Schema.Types.Mixed, required: true },

    modelUsed: { type: String, default: 'gemini-2.5-flash' },
    tokensUsed: { type: Number, default: 0 }
  },
  { timestamps: true }
);

aiAnalysisSchema.index({ userId: 1, type: 1, applicationId: 1 });

export const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);
