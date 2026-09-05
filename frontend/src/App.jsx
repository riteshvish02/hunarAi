import React, { useState } from 'react';
import Navbar from './component/Navbar';
import VoiceStudio from './component/VoiceStudio';
import { Users, BarChart3, Radio, ArrowRight, Sparkles } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('voice-agents');

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'voice-agents' && <VoiceStudio />}

        {activeTab === 'people-search' && (
          <div className="glass-panel p-10 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-indigo-400" />
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
              Ready for Step 2
            </span>
            <h2 className="text-xl font-bold text-white mt-3">People Search & JD Matching</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              In this feature, we will paste any Job Description (JD), extract required skills, search matching candidates across Apollo/PDL APIs, and dispatch Voice AI agents with one click.
            </p>
            <button
              onClick={() => setActiveTab('voice-agents')}
              className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
            >
              Test Voice AI Calls First <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="glass-panel p-10 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Step 3
            </span>
            <h2 className="text-xl font-bold text-white mt-3">Candidate Responses CRM & Analytics</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Consolidated recruitment dashboard displaying salary expectations, notice period, interview readiness, call recordings, and audio sentiment transcripts.
            </p>
          </div>
        )}

        {activeTab === 'attendance-case' && (
          <div className="glass-panel p-10 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <Radio className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              Step 4 (Assignment Part 3)
            </span>
            <h2 className="text-xl font-bold text-white mt-3">1000-Staff Attendance System (No Smartphones)</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Interactive system design solving 1000 daily employee check-ins across 100 locations without mobile apps using Voice AI, USSD, and LLM-powered verification.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.06] bg-dark-950/60 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Hunar.AI Hiring Assistant & Sourcing Co-Pilot</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Powered by Hunar Voice AI Engine
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
