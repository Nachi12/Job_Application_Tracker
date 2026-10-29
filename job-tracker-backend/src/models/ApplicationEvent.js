import mongoose from 'mongoose';

const { Schema } = mongoose;

const applicationEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'JobApplication', required: true, index: true },
    type: {
      type: String,
      enum: ['status_change', 'resume_submitted', 'recruiter_contacted', 'interview_scheduled', 'interview_completed', 'follow_up_sent', 'offer_received', 'rejected', 'note_added'],
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    eventDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

applicationEventSchema.index({ applicationId: 1, eventDate: -1 });

export const ApplicationEvent = mongoose.model('ApplicationEvent', applicationEventSchema);
