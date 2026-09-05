import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log(`[Database] Connected successfully to MongoDB: ${ENV.MONGODB_URI}`);
  } catch (error) {
    console.warn('[Database] MongoDB connection failed. Running in-memory mode for temporary data.', (error as Error).message);
  }
};

export default connectDB;