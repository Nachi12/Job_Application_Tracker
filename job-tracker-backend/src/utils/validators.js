import validator from 'validator';
import { ApiError } from './ApiError.js';

export const validateEmail = (email) => {
  if (!email || !validator.isEmail(email)) {
    throw new ApiError(400, 'Invalid email format');
  }
};

export const validatePassword = (password) => {
  // min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  const strong =
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  if (!strong) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters and include upper, lower, and number'
    );
  }
};

export const validateRequired = (fields, body) => {
  const missing = fields.filter((f) => !body[f]);
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }
};
