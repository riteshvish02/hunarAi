import mongoose, { Document, Schema } from 'mongoose';

export interface ICallRecord extends Document {
  callId: string;
  agentId: string;
  agentName?: string;
  candidateName: string;
  mobileNumber: string;
  jobRole?: string;
  status: string;
  durationSeconds?: number;
  recordingUrl?: string;
  answeredBy?: string;
  callEndedBy?: string;
  result?: Record<string, any>;
  customData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CallRecordSchema: Schema = new Schema(
  {
    callId: { type: String, required: true, unique: true, index: true },
    agentId: { type: String, required: true },
    agentName: { type: String },
    candidateName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    jobRole: { type: String },
    status: { type: String, default: 'INITIATED' },
    durationSeconds: { type: Number, default: 0 },
    recordingUrl: { type: String },
    answeredBy: { type: String },
    callEndedBy: { type: String },
    result: { type: Schema.Types.Mixed, default: {} },
    customData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const CallRecord = mongoose.model<ICallRecord>('CallRecord', CallRecordSchema);
