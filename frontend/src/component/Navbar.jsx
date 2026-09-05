import React, { useState, useEffect } from 'react';
import { Bot, PhoneCall, Users, BarChart3, Radio, Server, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [backendHealthy, setBackendHealthy] = useState(false);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        await apiService.checkHealth();
        setBackendHealthy(true);
      } catch (err) {
        setBackendHealthy(false);
      }
    };
    pingBackend();
    const interval = setInterval(pingBackend, 8000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'voice-agents', label: 'Voice AI Agents', icon: Bot, step: 'Feature 1' },
    { id: 'people-search', label: 'People Search & JD', icon: Users, step: 'Feature 2' },
    { id: 'responses', label: 'Call Responses CRM', icon: BarChart3, step: 'Feature 3' },
    { id: 'attendance-case', label: '1000-Staff System Design', icon: Radio, step: 'Feature 4' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Hunar.AI
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  Voice Agent Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Outbound Hiring & Sourcing Co-Pilot</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-dark-900/90 p-1.5 rounded-xl border border-white/[0.06]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-indigo-900/80 text-indigo-200' : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    {item.step}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* System Health Badge */}
          <div className="flex items-center gap-2.5">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                backendHealthy
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealthy ? 'bg-emerald-400 beacon-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline">
                {backendHealthy ? 'Backend Active (:5000)' : 'Connecting to Backend...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
