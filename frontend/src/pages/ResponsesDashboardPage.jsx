import React, { useState, useEffect } from 'react';
import { BarChart3, Phone, CheckCircle, XCircle, Clock, Volume2, Search, Filter, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

const ResponsesDashboardPage = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [autoSync, setAutoSync] = useState(true);

  const fetchCalls = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsSyncing(true);

    try {
      const res = await apiService.listCalls({ page_size: 50 });
      const callList = res.data?.results || [];
      setCalls(callList);

      // Keep selected call updated with latest data
      setSelectedCall((prev) => {
        if (!prev && callList.length > 0) return callList[0];
        if (prev) {
          const prevId = prev.id || prev.callId;
          const updated = callList.find((c) => (c.id || c.callId) === prevId);
          return updated ? { ...prev, ...updated } : prev;
        }
        return null;
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
      else setIsSyncing(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCalls(false);
  }, []);

  // Real-time auto-polling every 3 seconds
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchCalls(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoSync]);

  // If selected call is still in progress / ringing, poll its telemetry rapidly (every 2s)
  useEffect(() => {
    const selectedId = selectedCall?.id || selectedCall?.callId;
    if (!selectedId) return;
    const isFinished = ['COMPLETED', 'FAILED', 'BUSY', 'NO_ANSWER', 'NOT_CONNECTED'].includes(
      selectedCall.status
    );
    if (isFinished) return;

    const interval = setInterval(async () => {
      try {
        const res = await apiService.getCallDetails(selectedId);
        if (res.data) {
          setSelectedCall(res.data);
          setCalls((prev) =>
            prev.map((c) => ((c.id || c.callId) === selectedId ? { ...c, ...res.data } : c))
          );
        }
      } catch (err) {
        // silent polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedCall?.id, selectedCall?.callId, selectedCall?.status]);

  const filteredCalls = calls.filter((call) => {
    const name = call.callee_name || call.candidateName || '';
    const phone = call.mobile_number || call.mobileNumber || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedCount = calls.filter((c) => c.status === 'COMPLETED').length;
  const totalDuration = calls.reduce((acc, c) => acc + (c.duration_seconds || c.durationSeconds || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Feature 3 • Candidate Responses CRM
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Recruiter Responses Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Structured candidate conversation answers, compensation expectations, notice periods, and audio recordings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs shadow-sm shadow-emerald-500/10">
            <span className={`w-2 h-2 rounded-full ${autoSync ? 'bg-emerald-400 beacon-pulse' : 'bg-slate-500'}`} />
            <span className="text-emerald-300 font-semibold text-[11px]">
              {isSyncing ? 'Live Syncing...' : 'Real-Time Sync Active'}
            </span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">• Auto (3s)</span>
          </div>

          <button
            onClick={() => fetchCalls(false)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-dark-900 border border-white/[0.1] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Manual force refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <span className="text-xs text-slate-400 font-medium block">Total Reachouts</span>
          <span className="text-2xl font-black text-white mt-1 block">{calls.length}</span>
        </div>
        <div className="glass-panel p-4">
          <span className="text-xs text-slate-400 font-medium block">Calls Completed</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{completedCount}</span>
        </div>
        <div className="glass-panel p-4">
          <span className="text-xs text-slate-400 font-medium block">Total Airtime</span>
          <span className="text-2xl font-black text-indigo-400 mt-1 block">
            {Math.round(totalDuration / 60)}m {totalDuration % 60}s
          </span>
        </div>
        <div className="glass-panel p-4">
          <span className="text-xs text-slate-400 font-medium block">Conversion Rate</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">
            {calls.length > 0 ? `${Math.round((completedCount / calls.length) * 100)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* Main Filter & Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filterable Candidate List */}
        <div className="lg:col-span-7 glass-panel p-5 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate name or phone..."
                className="w-full bg-dark-950/80 border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-dark-950/80 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="NOT_CONNECTED">Not Connected</option>
            </select>
          </div>

          {/* Table */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredCalls.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No matching candidate calls found.
              </div>
            ) : (
              filteredCalls.map((call) => {
                const callId = call.id || call.callId;
                const selectedId = selectedCall?.id || selectedCall?.callId;
                const isSelected = selectedId === callId;
                const isCompleted = call.status === 'COMPLETED';
                const name = call.callee_name || call.candidateName || 'Candidate';
                const phone = call.mobile_number || call.mobileNumber || '';
                const duration = call.duration_seconds || call.durationSeconds || 0;
                const recording = call.recording_url || call.recordingUrl;

                return (
                  <div
                    key={callId}
                    onClick={() => setSelectedCall(call)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/25 border-emerald-500/50'
                        : 'bg-dark-950/60 border-white/[0.05] hover:border-white/[0.15]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{name}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                            isCompleted
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {call.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{phone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {duration > 0 && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {duration}s
                        </span>
                      )}
                      {recording && (
                        <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-indigo-400" /> Audio
                        </span>
                      )}
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Call Deep Dive */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 sticky top-20">
            {selectedCall ? (
              <div className="space-y-5">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Candidate Dossier
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedCall.callee_name || selectedCall.candidateName || 'Candidate'}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {selectedCall.mobile_number || selectedCall.mobileNumber || ''}
                  </p>
                </div>

                {/* Audio player if recording available */}
                {(selectedCall.recording_url || selectedCall.recordingUrl) && (
                  <div className="p-4 rounded-xl bg-dark-950/80 border border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-200">Call Audio Recording</span>
                    </div>
                    <audio controls className="w-full h-8" src={selectedCall.recording_url || selectedCall.recordingUrl} />
                  </div>
                )}

                {/* Structured Answers */}
                <div className="rounded-xl bg-dark-950/80 border border-white/[0.08] p-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Screening Answers
                  </h4>

                  {selectedCall.result && Object.keys(selectedCall.result).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(selectedCall.result).map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded-lg bg-dark-900/90 border border-white/[0.04] flex justify-between">
                          <span className="text-xs text-slate-400 capitalize">{k.replace(/_/g, ' ')}:</span>
                          <span className="text-xs font-semibold text-slate-200">
                            {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">
                      No structured responses captured for this call.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                Select a candidate call from the table to view conversation answers and audio playback.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsesDashboardPage;
