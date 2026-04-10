import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin:
        env.nodeEnv === 'production'
          ? env.frontendUrl
          : [env.frontendUrl, 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    })
  );

  // Logging
  if (env.nodeEnv !== 'test') {
    app.use(morgan(env.logLevel));
  }

  // Body parsing & limits
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Security middlewares
  app.use(mongoSanitize());
  app.use(hpp());

  // Rate limiting
  app.use('/api', apiLimiter);
  app.use('/api/auth', authLimiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
};