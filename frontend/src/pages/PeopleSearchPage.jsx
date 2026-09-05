import React, { useState } from 'react';
import { Users, Search, Sparkles, Briefcase, Filter, ArrowRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const PeopleSearchPage = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('Senior DevOps Engineer');

  const sampleJDs = [
    {
      title: 'Senior DevOps Engineer',
      desc: 'Looking for a DevOps Engineer with 4+ years experience in Kubernetes, Docker, AWS infrastructure, Terraform, and CI/CD automation pipelines.',
    },
    {
      title: 'Senior Backend Engineer (Python/FastAPI)',
      desc: 'Seeking a Senior Backend Engineer with strong experience in Python, FastAPI, PostgreSQL, Redis, distributed microservices, and asynchronous event streaming.',
    },
    {
      title: 'Full Stack Tech Lead',
      desc: 'Hiring a Tech Lead with proficiency in React, TypeScript, Node.js, system architecture, team mentorship, and scalable cloud deployments.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Feature 2 • Talent Sourcing Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            People Search & AI Reachout
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Input a Job Description to discover matching candidates via People APIs (PDL/Apollo) and dispatch automated Voice AI screening calls.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-dark-900 border border-white/[0.1] text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all self-start md:self-auto"
        >
          View Active Voice Agents <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* JD Input Panel & Preset Chips */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Paste Job Description (JD)
          </h2>
          <span className="text-[11px] text-slate-400">Quick Pre-fill:</span>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sampleJDs.map((sample) => (
            <button
              key={sample.title}
              type="button"
              onClick={() => {
                setTargetRole(sample.title);
                setJobDescription(sample.desc);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-dark-950/80 hover:bg-indigo-950/50 border border-white/[0.08] hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {sample.title}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Job Title / Designation
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior DevOps Engineer"
              className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Job Description & Candidate Requirements
            </label>
            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description, required technical stack, minimum years of experience, and location preference..."
              className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Supported Sources: People Data Labs (PDL), Apollo.IO, Proxycurl
            </span>

            <button
              type="button"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Extract Skills & Search Candidates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sourcing Results Section Placeholder */}
      <div className="glass-panel p-8 text-center border-dashed border-white/[0.12]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-6 h-6 text-indigo-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-200">Candidate Search Engine Ready</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Paste a JD above or pick a sample role to trigger candidate matching algorithms, review match scores, and initiate automated Voice AI phone calls.
        </p>
      </div>
    </div>
  );
};

export default PeopleSearchPage;
