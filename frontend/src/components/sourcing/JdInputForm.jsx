import React from 'react';
import { Briefcase, Sparkles, Loader2, Search, ArrowRight } from 'lucide-react';

const JdInputForm = ({
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  onAnalyze,
  loading,
}) => {
  const sampleJDs = [
    {
      title: 'Senior DevOps Engineer',
      desc: 'Looking for a Senior DevOps Engineer with 5+ years of experience in Kubernetes, Docker, AWS infrastructure, Terraform, Helm, and CI/CD pipelines. Must have experience managing high-availability production clusters and monitoring with Prometheus/Grafana.',
    },
    {
      title: 'Senior Backend Engineer (Python/FastAPI)',
      desc: 'Seeking a Senior Backend Engineer with strong expertise in Python, FastAPI, PostgreSQL, Redis, distributed microservices, and asynchronous event streaming with Kafka. Knowledge of Docker and cloud deployments is required.',
    },
    {
      title: 'Full Stack Tech Lead',
      desc: 'Hiring a Full Stack Tech Lead proficient in React, TypeScript, Node.js, Next.js, and system architecture. Experience leading agile engineering teams, conducting code reviews, and designing scalable cloud architectures is essential.',
    },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.08]">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Job Description & Sourcing Criteria
          </h2>
          <p className="text-[11px] text-slate-400">
            Paste any Job Description; Google Gemini will extract required skills and query Apollo/PDL candidate pools.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Quick Samples:</span>
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
            className="text-xs px-3 py-1.5 rounded-lg bg-dark-950/80 hover:bg-indigo-950/60 border border-white/[0.08] hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all cursor-pointer flex items-center gap-1.5 font-medium"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {sample.title}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAnalyze();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Role Title / Target Designation
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
            Full Job Description & Technical Requirements
          </label>
          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste complete job description, technical stack, required years of experience, and cloud competencies..."
            required
            className="w-full bg-dark-950/80 border border-white/[0.1] rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 resize-none font-sans"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-500">
            Powered by <strong>Gemini 2.5 Flash</strong> • Apollo.IO / PDL Engine
          </span>

          <button
            type="submit"
            disabled={loading || !jobDescription.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Extracting Skills with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Skills & Search Candidates</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JdInputForm;
