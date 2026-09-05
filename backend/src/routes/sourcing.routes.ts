import { Router } from 'express';
import { sourcingController } from '../controllers/sourcing.controller';

const router = Router();

// POST /api/sourcing/parse-jd - Parse JD with Gemini 2.5 Flash
router.post('/parse-jd', (req, res, next) => sourcingController.parseJobDescription(req, res, next));

// POST /api/sourcing/search - Search candidates from Apollo / PDL engine
router.post('/search', (req, res, next) => sourcingController.searchCandidates(req, res, next));

// POST /api/sourcing/reachout - Dispatch Voice AI call to candidate
router.post('/reachout', (req, res, next) => sourcingController.reachoutCandidate(req, res, next));

export default router;
