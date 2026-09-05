import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const apiService = {
  // Check backend health
  checkHealth: async () => {
    const res = await client.get('/health');
    return res.data;
  },

  // Fetch all Hunar Voice AI Agents
  getAgents: async () => {
    const res = await client.get('/agents');
    return res.data;
  },

  // Get specific agent details
  getAgentById: async (id) => {
    const res = await client.get(`/agents/${id}`);
    return res.data;
  },

  // Trigger an AI Voice Call
  triggerCall: async (payload) => {
    const res = await client.post('/calls/trigger', payload);
    return res.data;
  },

  // Get Call status, recording, and extracted responses
  getCallDetails: async (id) => {
    const res = await client.get(`/calls/${id}`);
    return res.data;
  },

  // List all calls
  listCalls: async (params = {}) => {
    const res = await client.get('/calls', { params });
    return res.data;
  },
};

export default apiService;
