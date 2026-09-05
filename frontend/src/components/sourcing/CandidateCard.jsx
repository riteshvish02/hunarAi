import React, { useState, useEffect } from 'react';
import { Phone, Building2, MapPin, Briefcase, Award, Loader2, CheckCircle2, AlertCircle, Bot } from 'lucide-react';
import { apiService } from '../../services/api';

const CandidateCard = ({ candidate, agents, onCallSuccess }) => {
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [phoneNumber, setPhoneNumber] = useState(candidate.mobileNumber || '+91');
  const [calling, setCalling] = useState(false);
  const [callSuccess, setCallSuccess] = useState(null);
  const [callError, setCallError] = useState(null);
  const [liveCall, setLiveCall] = useState(null);

  // Poll live call telemetry while call is active (every 2s)
  useEffect(() => {
    if (!liveCall?.id) return;
    const isFinished = ['COMPLETED', 'FAILED', 'BUSY', 'NO_ANSWER', 'NOT_CONNECTED'].includes(
      liveCall.status
    );
    if (isFinished) return;

    const interval = setInterval(async () => {
      try {
        const res = await apiService.getCallDetails(liveCall.id);
        if (res.data) {
          setLiveCall(res.data);
          if (res.data.status === 'COMPLETED') {
            setCallSuccess(`Call completed! Duration: ${res.data.duration_seconds || 0}s`);
          }
        }
      } catch (err) {
        // silent polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [liveCall?.id, liveCall?.status, candidate.fullName]);

  const handleReachout = async () => {
    if (!selectedAgentId) {
      setCallError('Please select a Voice Agent.');
      return;
    }

    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setCallError('Please enter a valid phone number (e.g. +91 9876543210).');
      return;
    }

    setCalling(true);
    setCallError(null);
    setCallSuccess(null);

    try {
      const res = await apiService.reachoutCandidate({
        candidate_id: candidate.id,
        agent_id: selectedAgentId,
        role_title: candidate.currentTitle,
        mobile_number: phoneNumber.trim(),
      });

      setLiveCall(res.call);
      setCallSuccess(`Voice call placed to ${phoneNumber}! Ringing...`);
      if (onCallSuccess) {
        onCallSuccess(res.call);
      }
    } catch (err) {
      setCallError(err.response?.data?.error || err.message || 'Failed to dispatch voice call');
    } finally {
      setCalling(false);
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4 hover:border-indigo-500/40 transition-all">
      {/* Top Profile Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={candidate.avatarUrl}
            alt={candidate.fullName}
            className="w-12 h-12 rounded-xl object-cover border border-white/[0.1] shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{candidate.fullName}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {candidate.matchScore}% Match
              </span>
            </div>
            <p className="text-xs font-semibold text-indigo-300 mt-0.5">{candidate.currentTitle}</p>
          </div>
        </div>

        {/* Source Badge */}
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 uppercase border border-white/[0.06]">
          {candidate.source}
        </span>
      </div>

      {/* Company, Exp, Location */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-dark-950/60 border border-white/[0.04] flex items-center gap-1.5 text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{candidate.currentCompany}</span>
        </div>
        <div className="p-2 rounded-lg bg-dark-950/60 border border-white/[0.04] flex items-center gap-1.5 text-slate-300">
          <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{candidate.experienceYears}y Exp</span>
        </div>
        <div className="p-2 rounded-lg bg-dark-950/60 border border-white/[0.04] flex items-center gap-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{candidate.location.split(',')[0]}</span>
        </div>
      </div>

      {/* Match Reason */}
      <p className="text-xs text-slate-400 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.03]">
        <strong className="text-slate-300">Fit Reason:</strong> {candidate.matchReason}
      </p>

      {/* Skills Chips */}
      <div className="flex flex-wrap gap-1.5">
        {candidate.skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-0.5 rounded-md bg-dark-950 text-slate-300 border border-white/[0.06]"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Error or Success notification */}
      {callError && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span>{callError}</span>
        </div>
      )}

      {callSuccess && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          <span>{callSuccess}</span>
        </div>
      )}

      {/* Real-time Live Call Telemetry Widget */}
      {liveCall && (
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                liveCall.status === 'COMPLETED'
                  ? 'bg-emerald-400'
                  : 'bg-indigo-400 beacon-pulse'
              }`}
            />
            <span className="font-semibold text-slate-200">
              {liveCall.status === 'INITIATED' && 'Agent Dispatched...'}
              {liveCall.status === 'RINGING' && 'Ringing Candidate...'}
              {liveCall.status === 'IN_PROGRESS' && 'AI Conversation Active'}
              {liveCall.status === 'COMPLETED' && 'Conversation Finished'}
              {!['INITIATED', 'RINGING', 'IN_PROGRESS', 'COMPLETED'].includes(liveCall.status) &&
                `Status: ${liveCall.status}`}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {liveCall.duration_seconds > 0 && (
              <span className="font-mono text-[11px] text-slate-400">
                {liveCall.duration_seconds}s
              </span>
            )}
            <a
              href="/responses"
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
            >
              CRM Dossier →
            </a>
          </div>
        </div>
      )}

      {/* Editable Phone Field for Live Testing */}
      <div className="p-2.5 rounded-xl bg-dark-950/70 border border-white/[0.08] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Phone className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-medium">Dial Number:</span>
        </div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+91 9876543210"
          className="bg-dark-900 border border-white/[0.1] rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-mono text-right focus:outline-none focus:border-indigo-500 w-44"
          title="Edit this number to test on your own phone!"
        />
      </div>

      {/* Action Row: Agent Select & Call Button */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
        <select
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}
          className="flex-1 bg-dark-950/80 border border-white/[0.1] rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleReachout}
          disabled={calling}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {calling ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Dialing...</span>
            </>
          ) : (
            <>
              <Phone className="w-3.5 h-3.5" />
              <span>Call via AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
