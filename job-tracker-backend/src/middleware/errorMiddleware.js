import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    env.nodeEnv === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Something went wrong';

  res.status(status).json({
    error: message,
    errors: err.errors || undefined
  });
};
