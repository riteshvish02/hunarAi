import { Router } from 'express';
import agentRoutes from './agent.routes';
import callRoutes from './call.routes';
import sourcingRoutes from './sourcing.routes';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Hunar AI Hiring Assistant Backend',
    timestamp: new Date().toISOString(),
  });
});

// Hunar Voice AI agents & calls
router.use('/agents', agentRoutes);
router.use('/calls', callRoutes);
router.use('/sourcing', sourcingRoutes);

export default router;