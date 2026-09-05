import React from 'react';
import { Phone, Clock, Play, User, ArrowUpRight } from 'lucide-react';

const CallHistoryMini = ({ calls, onSelectCall, selectedCallId }) => {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-400" />
            Recent Outbound Calls
          </h3>
          <p className="text-[11px] text-slate-400">Click any call to inspect details and audio playback</p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
          {calls.length} logged
        </span>
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {calls.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No calls recorded yet. Trigger your first AI call above!
          </div>
        ) : (
          calls.slice(0, 15).map((call) => {
            const callId = call.id || call.callId;
            const isSelected = selectedCallId === callId;
            const isCompleted = call.status === 'COMPLETED';
            const name = call.callee_name || call.candidateName || 'Candidate';
            const phone = call.mobile_number || call.mobileNumber || '';
            const duration = call.duration_seconds || call.durationSeconds || 0;
            const recording = call.recording_url || call.recordingUrl;

            return (
              <div
                key={callId}
                onClick={() => onSelectCall(call)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/50'
                    : 'bg-dark-950/60 border-white/[0.05] hover:border-white/[0.15] hover:bg-dark-950/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {call.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">{phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {duration > 0 && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {duration}s
                    </span>
                  )}
                  {recording && (
                    <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      <Play className="w-2.5 h-2.5 fill-indigo-400" /> Audio
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
  );
};

export default CallHistoryMini;
