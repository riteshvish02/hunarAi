export interface HunarAgent {
  id: string;
  name: string;
  voice_persona?: string;
  persona_name?: string;
  voice_name?: string;
  summary?: string;
  logo?: string;
  language: string;
  custom_variables: string[];
  result_schema?: Record<string, string>;
  agent_code?: string;
  result_variables: string[];
  required_variables: string[];
  status: string;
  introduction?: string;
  agent_prompt?: string;
}

export interface HunarAgentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HunarAgent[];
}

export interface TriggerCallPayload {
  agent_id: string;
  callee_name: string;
  mobile_number: string;
  custom_data: Record<string, any>;
  from_phone_number?: string;
  request_id?: string;
  callback_config?: {
    url: string;
    events?: string[];
  };
}

export interface BulkCallItem {
  callee_name: string;
  mobile_number: string;
  custom_data?: Record<string, any>;
}

export interface BulkCallPayload {
  agent_id: string;
  request_id?: string;
  from_phone_number?: string;
  data: BulkCallItem[];
}

export interface HunarCall {
  id: string;
  callee_name: string;
  mobile_number: string;
  from_phone_number?: string;
  agent_id: string;
  language?: string;
  status: string;
  lifecycle_status?: string;
  recording_url?: string;
  custom_data?: Record<string, any>;
  duration_minutes?: number;
  duration_seconds?: number;
  user_speech_duration?: number;
  engagement_status?: string;
  answered_by?: string;
  call_ended_by?: string;
  request_id?: string;
  result?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface HunarCallsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HunarCall[];
}
