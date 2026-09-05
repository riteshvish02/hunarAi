import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';
import CandidateCard from './CandidateCard';

const CandidateList = ({ candidates, agents, onCallSuccess }) => {
  const [filterText, setFilterText] = useState('');

  if (!candidates || candidates.length === 0) return null;

  const filtered = candidates.filter(
    (c) =>
      c.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
      c.currentTitle.toLowerCase().includes(filterText.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Matching Candidate Profiles ({filtered.length})
          </h2>
          <p className="text-[11px] text-slate-400">
            Ranked by relevance to extracted skills and technical requirements
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter candidates (e.g. Ritesh)..."
            className="bg-dark-950/80 border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-56 placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            agents={agents}
            onCallSuccess={onCallSuccess}
          />
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
