import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'dev',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || ''
};


if (!env.mongoUri) {
  throw new Error('MONGODB_URI is required');
}
if (!env.jwtSecret) {
  throw new Error('JWT_SECRET is required');
}
