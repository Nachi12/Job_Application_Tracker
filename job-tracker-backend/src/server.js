import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

const start = async () => {
  try {
    console.log('Starting server...');

    await connectDB();
    console.log('MongoDB connected');

    const app = createApp();

    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

start();