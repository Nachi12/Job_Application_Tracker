import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptionPlan: { type: String, enum: ['FREE', 'PRO'], default: 'FREE' },
    profile: {
      title: { type: String, default: '' },
      skills: [{ type: String }],
      targetRoles: [{ type: String }],
      experienceYears: { type: Number, default: 0 },
      location: { type: String, default: '' },
      bio: { type: String, default: '' }
    },
    resetPasswordTokenHash: String,
    resetPasswordExpiresAt: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Only hash if password is not already a bcrypt hash (bcrypt hashes start with $2a$ or $2b$)
  if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);