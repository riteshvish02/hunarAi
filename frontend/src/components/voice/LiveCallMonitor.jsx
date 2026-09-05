import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  RefreshCw, 
  Volume2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { apiService } from '../../services/api';

const LiveCallMonitor = ({ activeCall, onRefresh }) => {
  const [callDetails, setCallDetails] = useState(activeCall);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setCallDetails(activeCall);
  }, [activeCall]);

  // Periodic poller while call is active
  useEffect(() => {
    if (!callDetails?.id) return;
    const isFinished = ['COMPLETED', 'FAILED', 'BUSY', 'NO_ANSWER', 'NOT_CONNECTED'].includes(
      callDetails.status
    );
    if (isFinished) return;

    const interval = setInterval(async () => {
      try {
        const res = await apiService.getCallDetails(callDetails.id);
        if (res.data) {
          setCallDetails(res.data);
        }
      } catch (err) {
        // quiet poll
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [callDetails?.id, callDetails?.status]);

  const handleManualRefresh = async () => {
    if (!callDetails?.id) return;
    setRefreshing(true);
    try {
      const res = await apiService.getCallDetails(callDetails.id);
      if (res.data) {
        setCallDetails(res.data);
        if (onRefresh) onRefresh(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  if (!callDetails) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center text-center min-h-[360px] border-dashed border-white/[0.1]">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-3">
          <PhoneCall className="w-7 h-7 text-indigo-400 opacity-60" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">Live Call Monitor Idle</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select an AI voice agent and initiate a candidate call to inspect live telemetry, waveform, conversation answers, and audio playback.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> Call Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-indigo-400 beacon-pulse" /> In Call
          </span>
        );
      case 'RINGING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 beacon-pulse" /> Ringing Candidate
          </span>
        );
      case 'INITIATED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Dispatching Agent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Radio className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Live Call Telemetry</h3>
            <p className="text-xs text-slate-400 font-mono">ID: {callDetails.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(callDetails.status)}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-all cursor-pointer border border-white/[0.08]"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Candidate Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-dark-950/60 border border-white/[0.06]">
          <span className="text-[11px] text-slate-400 font-medium block">Candidate</span>
          <span className="text-sm font-bold text-slate-100">{callDetails.callee_name}</span>
        </div>
        <div className="p-3 rounded-xl bg-dark-950/60 border border-white/[0.06]">
          <span className="text-[11px] text-slate-400 font-medium block">Phone</span>
          <span className="text-sm font-mono font-semibold text-indigo-300">{callDetails.mobile_number}</span>
        </div>
        <div className="p-3 rounded-xl bg-dark-950/60 border border-white/[0.06]">
          <span className="text-[11px] text-slate-400 font-medium block">Duration</span>
          <span className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {callDetails.duration_seconds ? `${callDetails.duration_seconds}s` : `${callDetails.duration_minutes || 0}m`}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-dark-950/60 border border-white/[0.06]">
          <span className="text-[11px] text-slate-400 font-medium block">Answered By</span>
          <span className="text-sm font-bold text-emerald-300">
            {callDetails.answered_by || 'Awaiting connection'}
          </span>
        </div>
      </div>

      {/* Audio Waveform Animation when call is ringing or in-progress */}
      {['IN_PROGRESS', 'RINGING', 'INITIATED'].includes(callDetails.status) && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-dark-950/60 to-cyan-950/40 border border-indigo-500/20 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 h-7">
              <span className="w-1.5 bg-indigo-400 rounded-full wave-animate-1" />
              <span className="w-1.5 bg-cyan-400 rounded-full wave-animate-2" />
              <span className="w-1.5 bg-indigo-400 rounded-full wave-animate-3" />
              <span className="w-1.5 bg-indigo-300 rounded-full wave-animate-4" />
              <span className="w-1.5 bg-cyan-300 rounded-full wave-animate-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">AI Voice Conversation Active</p>
              <p className="text-[11px] text-slate-400">Speech recognition and intent parsing in progress...</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
            LIVE
          </span>
        </div>
      )}

      {/* Audio Recording Player if call completed */}
      {callDetails.recording_url && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-indigo-200">Call Audio Recording</h4>
          </div>
          <audio controls className="w-full h-9 rounded-lg" src={callDetails.recording_url}>
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {/* Structured AI Answers Extracted */}
      <div className="rounded-xl bg-dark-950/80 border border-white/[0.08] p-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Extracted Conversation Answers
        </h4>

        {callDetails.result && Object.keys(callDetails.result).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(callDetails.result).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-lg bg-dark-900/90 border border-white/[0.04]">
                <span className="text-[11px] text-slate-400 font-medium capitalize block">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {typeof val === 'boolean' ? (val ? 'Yes (Qualified)' : 'No') : String(val)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-slate-500">
            {callDetails.status === 'COMPLETED'
              ? 'No structured variables were captured in this conversation.'
              : 'Answers will appear automatically once candidate completes the call.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCallMonitor;
