import React, { useState, useEffect } from 'react';
import { BarChart3, Phone, CheckCircle, XCircle, Clock, Volume2, Search, Filter, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

const ResponsesDashboardPage = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const res = await apiService.listCalls({ page_size: 50 });
      const callList = res.data?.results || [];
      setCalls(callList);
      if (callList.length > 0 && !selectedCall) {
        setSelectedCall(callList[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.callee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.mobile_number?.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedCount = calls.filter((c) => c.status === 'COMPLETED').length;
  const totalDuration = calls.reduce((acc, c) => acc + (c.duration_seconds || 0), 0);

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

        <button
          onClick={fetchCalls}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-dark-900 border border-white/[0.1] text-slate-300 hover:text-white transition-all self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          Refresh Records
        </button>
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
                const isSelected = selectedCall?.id === call.id;
                const isCompleted = call.status === 'COMPLETED';

                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/25 border-emerald-500/50'
                        : 'bg-dark-950/60 border-white/[0.05] hover:border-white/[0.15]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{call.callee_name}</span>
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
                      <span className="text-[11px] font-mono text-slate-400">{call.mobile_number}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {call.duration_seconds > 0 && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {call.duration_seconds}s
                        </span>
                      )}
                      {call.recording_url && (
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
                  <h3 className="text-lg font-bold text-white mt-1">{selectedCall.callee_name}</h3>
                  <p className="text-xs font-mono text-slate-400">{selectedCall.mobile_number}</p>
                </div>

                {/* Audio player if recording available */}
                {selectedCall.recording_url && (
                  <div className="p-4 rounded-xl bg-dark-950/80 border border-indigo-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-200">Call Audio Recording</span>
                    </div>
                    <audio controls className="w-full h-8" src={selectedCall.recording_url} />
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
