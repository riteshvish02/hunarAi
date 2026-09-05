import React, { useState } from 'react';
import { PhoneOutgoing, Loader2, Sparkles, AlertCircle, CheckCircle2, User, Phone, Briefcase } from 'lucide-react';
import { apiService } from '../services/api';

const VoiceCallTrigger = ({ agents, selectedAgent, onSelectAgent, onCallInitiated }) => {
  const [candidateName, setCandidateName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [roleTitle, setRoleTitle] = useState('Senior Fullstack Engineer');
  const [keyRequirements, setKeyRequirements] = useState('React, TypeScript, Node.js, 4+ years exp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleTrigger = async (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      setError('Please select a Voice AI Agent first.');
      return;
    }
    if (!candidateName.trim() || !mobileNumber.trim()) {
      setError('Candidate name and mobile number are required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        agent_id: selectedAgent.id,
        callee_name: candidateName.trim(),
        mobile_number: mobileNumber.trim(),
        custom_data: {
          role_title: roleTitle.trim(),
          job_title: roleTitle.trim(),
          key_requirements: keyRequirements.trim(),
        },
      };

      const res = await apiService.triggerCall(payload);
      setSuccessMessage(`Call queued successfully with ID: ${res.data?.id}`);
      if (onCallInitiated) {
        onCallInitiated(res.data);
      }
    } catch (err) {
      const errDetail = err.response?.data?.error || err.message || 'Failed to initiate outbound call.';
      setError(errDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PhoneOutgoing className="w-5 h-5 text-indigo-400" />
            Trigger AI Voice Call
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Initiate real-time outbound screening call through Hunar.AI voice infrastructure
          </p>
        </div>

        {selectedAgent && (
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Selected Agent:</span>
            <span className="text-xs font-bold text-indigo-300">{selectedAgent.name}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Call Initiation Error</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Voice Agent Dispatched!</p>
            <p className="mt-0.5 opacity-90">{successMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleTrigger} className="space-y-4">
        {/* Agent Picker Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Target Voice AI Agent <span className="text-rose-400">*</span>
          </label>
          <select
            value={selectedAgent?.id || ''}
            onChange={(e) => {
              const agent = agents.find((a) => a.id === e.target.value);
              onSelectAgent(agent);
            }}
            className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id} className="bg-dark-900 text-slate-200">
                {agent.name} — ({agent.voice_persona || agent.persona_name || 'AI Recruiter'} / {agent.language})
              </option>
            ))}
          </select>
        </div>

        {/* Candidate Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Candidate Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Ritesh Vishwakarma"
                required
                className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mobile Number (with Country Code) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. +91 9876543210"
                required
                className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Custom Variables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Job Title / Role (Passed to Voice Agent)
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Senior DevOps Engineer"
                className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Key Screening Requirements
            </label>
            <input
              type="text"
              value={keyRequirements}
              onChange={(e) => setKeyRequirements(e.target.value)}
              placeholder="e.g. Kubernetes, AWS, CI/CD pipelines, 5+ yrs"
              className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Connecting to Hunar Voice Gateway...</span>
              </>
            ) : (
              <>
                <PhoneOutgoing className="w-4 h-4" />
                <span>Call Candidate Now via Voice AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VoiceCallTrigger;
