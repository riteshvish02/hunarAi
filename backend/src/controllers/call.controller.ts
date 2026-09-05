import { Request, Response, NextFunction } from 'express';
import { hunarService } from '../services/hunar.service';

export class CallController {
  /**
   * POST /api/calls/trigger
   * Trigger an outbound AI voice call to a candidate
   */
  async triggerCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { agent_id, callee_name, mobile_number, custom_data = {}, from_phone_number } = req.body;

      if (!agent_id || !callee_name || !mobile_number) {
        res.status(400).json({
          success: false,
          error: 'agent_id, callee_name, and mobile_number are required fields',
        });
        return;
      }

      // Ensure standard E.164 phone formatting (prefix +91 if 10-digit Indian number without prefix)
      let formattedNumber = mobile_number.trim();
      if (!formattedNumber.startsWith('+')) {
        if (formattedNumber.length === 10) {
          formattedNumber = `+91${formattedNumber}`;
        } else {
          formattedNumber = `+${formattedNumber}`;
        }
      }

      const payload = {
        agent_id,
        callee_name,
        mobile_number: formattedNumber,
        custom_data: custom_data || {},
        from_phone_number,
        request_id: `recruiter-call-${Date.now()}`,
      };

      const result = await hunarService.triggerCall(payload);

      res.status(201).json({
        success: true,
        message: 'Outbound call initiated successfully',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * POST /api/calls/bulk
   * Trigger bulk outbound calls
   */
  async triggerBulkCalls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { agent_id, data, from_phone_number } = req.body;

      if (!agent_id || !Array.isArray(data) || data.length === 0) {
        res.status(400).json({
          success: false,
          error: 'agent_id and a non-empty data array are required',
        });
        return;
      }

      const formattedData = data.map((item) => {
        let num = item.mobile_number.trim();
        if (!num.startsWith('+')) {
          num = num.length === 10 ? `+91${num}` : `+${num}`;
        }
        return {
          ...item,
          mobile_number: num,
          custom_data: item.custom_data || {},
        };
      });

      const results = await hunarService.triggerBulkCalls({
        agent_id,
        request_id: `bulk-batch-${Date.now()}`,
        from_phone_number,
        data: formattedData,
      });

      res.status(201).json({
        success: true,
        message: `Successfully initiated ${results.length} calls`,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/calls/:id
   * Get real-time status, answers, and recording for a specific call
   */
  async getCallDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const call = await hunarService.getCallDetails(id);

      res.status(200).json({
        success: true,
        data: call,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/calls
   * List all calls from Hunar and local database
   */
  async listCalls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, page, page_size } = req.query;
      const callsResponse = await hunarService.listCalls({
        status: status as string,
        page: page ? parseInt(page as string, 10) : 1,
        page_size: page_size ? parseInt(page_size as string, 10) : 50,
      });

      res.status(200).json({
        success: true,
        data: callsResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/calls/webhook
   * Webhook endpoint for receiving status callbacks from Hunar Voice AI
   */
  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = req.body;
      console.log('[Hunar Webhook Event Received]:', JSON.stringify(event, null, 2));

      if (event?.id) {
        await hunarService.updateCallRecord(event.id, {
          status: event.status,
          durationSeconds: event.duration_seconds,
          recordingUrl: event.recording_url,
          result: event.result,
        });
      }

      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}

export const callController = new CallController();
