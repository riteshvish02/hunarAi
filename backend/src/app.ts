import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { Pubsub } from './redis/redis';
import apiRouter from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Enable Cross-Origin Resource Sharing for frontend
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hunar AI Voice Hiring Assistant API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      agents: '/api/agents',
      calls: '/api/calls',
      triggerCall: 'POST /api/calls/trigger',
    },
  });
});

// Global Error Handler
app.use(errorHandler);

// Initialize DB and Redis
connectDB();
Pubsub.getInstance();

const PORT = ENV.PORT;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Hunar Voice API: ${ENV.HUNAR_BASE_URL}`);
  console.log(`=========================================`);
});

export default app;