import { Router } from 'express';
import { callController } from '../controllers/call.controller';

const router = Router();

// POST /api/calls/trigger - Trigger outbound call
router.post('/trigger', (req, res, next) => callController.triggerCall(req, res, next));

// POST /api/calls/bulk - Trigger bulk outbound calls
router.post('/bulk', (req, res, next) => callController.triggerBulkCalls(req, res, next));

// GET /api/calls - List calls
router.get('/', (req, res, next) => callController.listCalls(req, res, next));

// GET /api/calls/:id - Get call details & recording
router.get('/:id', (req, res, next) => callController.getCallDetails(req, res, next));

// POST /api/calls/webhook - Webhook for real-time status updates
router.post('/webhook', (req, res, next) => callController.handleWebhook(req, res, next));

export default router;
