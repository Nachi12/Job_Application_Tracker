import mongoose from 'mongoose';

const { Schema } = mongoose;

const reminderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'JobApplication', index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['follow_up', 'interview', 'inactivity', 'custom'],
      default: 'follow_up'
    },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'snoozed'],
      default: 'pending'
    },
    emailSent: { type: Boolean, default: false },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

reminderSchema.index({ userId: 1, status: 1, dueDate: 1 });

export const Reminder = mongoose.model('Reminder', reminderSchema);
