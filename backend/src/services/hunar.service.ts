import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/env';
import {
  HunarAgent,
  HunarAgentsResponse,
  HunarCall,
  HunarCallsResponse,
  TriggerCallPayload,
  BulkCallPayload,
} from '../types/hunar.types';
import { CallRecord } from '../models/callRecord.model';

class HunarService {
  private client: AxiosInstance;
  // In-memory fallback if MongoDB is not connected
  private inMemoryCalls: Map<string, any> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: ENV.HUNAR_BASE_URL,
      headers: {
        'X-API-Key': ENV.HUNAR_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  /**
   * Fetch list of all active Voice AI agents
   */
  async getAgents(): Promise<HunarAgent[]> {
    try {
      const response = await this.client.get<HunarAgentsResponse>('/agents/');
      return response.data.results || [];
    } catch (error: any) {
      console.error('[HunarService] Failed to fetch agents:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch Hunar Voice Agents');
    }
  }

  /**
   * Fetch specific agent details
   */
  async getAgentById(agentId: string): Promise<HunarAgent> {
    try {
      const response = await this.client.get<HunarAgent>(`/agents/${agentId}/`);
      return response.data;
    } catch (error: any) {
      console.error(`[HunarService] Failed to fetch agent ${agentId}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || `Failed to fetch agent ${agentId}`);
    }
  }

  /**
   * Trigger a single outbound call to a candidate
   */
  async triggerCall(payload: TriggerCallPayload): Promise<HunarCall> {
    try {
      console.log(`[HunarService] Initiating call to ${payload.callee_name} (${payload.mobile_number}) with agent ${payload.agent_id}`);
      const response = await this.client.post<HunarCall>('/calls/', payload);
      const callData = response.data;

      // Save to local persistence
      await this.saveCallRecord({
        callId: callData.id,
        agentId: payload.agent_id,
        candidateName: payload.callee_name,
        mobileNumber: payload.mobile_number,
        jobRole: payload.custom_data?.role_title || payload.custom_data?.job_title,
        status: callData.status || 'INITIATED',
        customData: payload.custom_data,
        result: callData.result || {},
      });

      return callData;
    } catch (error: any) {
      console.error('[HunarService] Failed to trigger call:', error.response?.data || error.message);
      throw new Error(
        JSON.stringify(error.response?.data) || error.message || 'Failed to trigger outbound call'
      );
    }
  }

  /**
   * Trigger multiple calls in bulk
   */
  async triggerBulkCalls(payload: BulkCallPayload): Promise<HunarCall[]> {
    try {
      const response = await this.client.post<HunarCall[]>('/calls/bulk/', payload);
      const createdCalls = response.data;

      for (const call of createdCalls) {
        await this.saveCallRecord({
          callId: call.id,
          agentId: payload.agent_id,
          candidateName: call.callee_name,
          mobileNumber: call.mobile_number,
          status: call.status || 'INITIATED',
          customData: call.custom_data,
        });
      }

      return createdCalls;
    } catch (error: any) {
      console.error('[HunarService] Failed to trigger bulk calls:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to trigger bulk outbound calls');
    }
  }

  /**
   * Retrieve call details and conversation answers from Hunar API
   */
  async getCallDetails(callId: string): Promise<HunarCall> {
    try {
      const response = await this.client.get<HunarCall>(`/calls/${callId}/`);
      const call = response.data;

      // Sync latest updates into local storage
      await this.updateCallRecord(callId, {
        status: call.status,
        durationSeconds: call.duration_seconds || (call.duration_minutes ? Math.round(call.duration_minutes * 60) : 0),
        recordingUrl: call.recording_url,
        answeredBy: call.answered_by,
        callEndedBy: call.call_ended_by,
        result: call.result,
      });

      return call;
    } catch (error: any) {
      console.error(`[HunarService] Failed to fetch call ${callId}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || `Failed to fetch call details for ${callId}`);
    }
  }

  /**
   * List calls from Hunar API or local DB
   */
  async listCalls(params?: { status?: string; page?: number; page_size?: number }): Promise<HunarCallsResponse> {
    try {
      const response = await this.client.get<HunarCallsResponse>('/calls/', { params });
      return response.data;
    } catch (error: any) {
      console.warn('[HunarService] Hunar list calls API failed, falling back to local records:', error.message);
      const records = await this.getLocalRecords();
      return {
        count: records.length,
        next: null,
        previous: null,
        results: records as any,
      };
    }
  }

  /**
   * Local persistence helper with MongoDB + in-memory fallback
   */
  private async saveCallRecord(data: any): Promise<void> {
    this.inMemoryCalls.set(data.callId, { ...data, updatedAt: new Date(), createdAt: new Date() });
    try {
      await CallRecord.findOneAndUpdate({ callId: data.callId }, data, { upsert: true, new: true });
    } catch (e) {
      // Mongo might not be running; inMemory is active
    }
  }

  /**
   * Update existing call record
   */
  async updateCallRecord(callId: string, updates: Partial<any>): Promise<void> {
    const existing = this.inMemoryCalls.get(callId) || {};
    this.inMemoryCalls.set(callId, { ...existing, ...updates, updatedAt: new Date() });

    try {
      await CallRecord.findOneAndUpdate({ callId }, { $set: updates });
    } catch (e) {
      // Fallback
    }
  }

  /**
   * Get all local records (merging DB and in-memory)
   */
  async getLocalRecords(): Promise<any[]> {
    try {
      const dbRecords = await CallRecord.find().sort({ createdAt: -1 }).lean();
      if (dbRecords && dbRecords.length > 0) return dbRecords;
    } catch (e) {
      // Fallback to memory
    }
    return Array.from(this.inMemoryCalls.values()).reverse();
  }
}

export const hunarService = new HunarService();
