import { Router } from 'express';
import { agentController } from '../controllers/agent.controller';

const router = Router();

// GET /api/agents - List all active Voice AI agents
router.get('/', (req, res, next) => agentController.getAgents(req, res, next));

// GET /api/agents/:id - Get specific agent details
router.get('/:id', (req, res, next) => agentController.getAgentById(req, res, next));

export default router;
