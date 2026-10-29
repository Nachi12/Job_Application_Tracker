import mongoose from 'mongoose';

const { Schema } = mongoose;

const activityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted'],
      required: true
    },
    entity: {
      type: String,
      enum: ['job'],
      default: 'job'
    },
    entityId: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: { createdAt: 'timestamp', updatedAt: false } }
);

activityLogSchema.index({ userId: 1, timestamp: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
