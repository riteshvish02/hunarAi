import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  HUNAR_API_KEY: process.env.HUNAR_API_KEY || '',
  HUNAR_BASE_URL: process.env.HUNAR_BASE_URL || 'https://api.voice.hunar.ai/external/v1',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hunarai',
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
