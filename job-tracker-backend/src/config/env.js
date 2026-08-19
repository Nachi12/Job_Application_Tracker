import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://jobtrackeruser:Test1234@cluster0.oqsk4w4.mongodb.net/?appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'hirelog_default_jwt_secret_key_2025',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'dev',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || ''
};

