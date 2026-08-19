import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import {
  validateEmail,
  validatePassword,
  validateRequired
} from '../utils/validators.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  subscriptionPlan: user.subscriptionPlan,
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  validateRequired(['name', 'email', 'password'], req.body);
  validateEmail(email);
  validatePassword(password);

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = signToken(user);

  res.status(201).json({
    user: buildUserResponse(user),
    token
  });
});


export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(user);
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  validateRequired(['email', 'password'], req.body);
  validateEmail(email);

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken(user);

  res.json({
    user: buildUserResponse(user),
    token
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  validateRequired(['email'], req.body);
  validateEmail(email);

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'If that email exists, reset link sent' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordTokenHash = resetTokenHash;
  user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  await sendPasswordResetEmail(email, resetToken);

  res.json({ message: 'If that email exists, reset link sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  validateRequired(['token', 'password'], req.body);
  validatePassword(password);

  const resetTokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordTokenHash,
    resetPasswordExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or has expired');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordTokenHash = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  const jwtToken = signToken(user);

  res.json({
    message: 'Password reset successful',
    user: buildUserResponse(user),
    token: jwtToken
  });
});