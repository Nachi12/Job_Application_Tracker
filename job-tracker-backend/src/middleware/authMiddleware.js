// import jwt from 'jsonwebtoken';
// import { env } from '../config/env.js';
// import { ApiError } from '../utils/ApiError.js';

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     throw new ApiError(401, 'Authorization token missing');
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, env.jwtSecret);
//     req.user = decoded; // 🔥 important
//     next();
//   } catch {
//     throw new ApiError(401, 'Invalid token');
//   }
// };



import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization token missing');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid token');
  }
};