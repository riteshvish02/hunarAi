import React from 'react';
import { Sparkles, CheckCircle2, Award, Clock, Cpu } from 'lucide-react';

const CriteriaBadges = ({ criteria }) => {
  if (!criteria) return null;

  return (
    <div className="glass-panel p-5 space-y-4 border-indigo-500/30 bg-indigo-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Gemini Extracted Sourcing Criteria</h3>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          {criteria.extracted_via === 'gemini' ? 'Gemini 2.5 Flash LLM' : 'NLP Rule Engine'}
        </span>
      </div>

      {/* Meta tags */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-dark-950/70 border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 font-medium block">Extracted Target Role</span>
          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            {criteria.role_title}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950/70 border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 font-medium block">Seniority Band</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {criteria.seniority}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950/70 border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 font-medium block">Experience Threshold</span>
          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {criteria.min_experience_years}+ Years
          </span>
        </div>
      </div>

      {/* Required skills chips */}
      <div>
        <span className="text-[11px] font-semibold text-slate-300 block mb-2">
          Target Skills Identified:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {criteria.required_skills?.map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-200 border border-indigo-500/30 font-semibold"
            >
              {skill}
            </span>
          ))}
          {criteria.preferred_skills?.map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-400 border border-white/[0.08]"
            >
              {skill} (preferred)
            </span>
          ))}
        </div>
      </div>

      {/* Pitch summary */}
      {criteria.summary && (
        <div className="p-3 rounded-xl bg-dark-950/60 border border-white/[0.04] text-xs text-slate-300 italic">
          "{criteria.summary}"
        </div>
      )}
    </div>
  );
};

export default CriteriaBadges;
