import { Request, Response, NextFunction } from 'express';
import { hunarService } from '../services/hunar.service';

export class AgentController {
  /**
   * GET /api/agents
   * Fetch all active Hunar Voice agents
   */
  async getAgents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agents = await hunarService.getAgents();
      res.status(200).json({
        success: true,
        count: agents.length,
        data: agents,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/agents/:id
   * Fetch specific agent details
   */
  async getAgentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const agent = await hunarService.getAgentById(id);
      res.status(200).json({
        success: true,
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const agentController = new AgentController();
