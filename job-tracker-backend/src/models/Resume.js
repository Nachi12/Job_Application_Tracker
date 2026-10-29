import mongoose from 'mongoose';

const { Schema } = mongoose;

const resumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    parsedData: {
      summary: String,
      skills: [String],
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          bulletPoints: [String]
        }
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String
        }
      ]
    },
    isPrimary: { type: Boolean, default: false },
    version: { type: String, default: '1.0' }
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, isPrimary: -1 });

export const Resume = mongoose.model('Resume', resumeSchema);
