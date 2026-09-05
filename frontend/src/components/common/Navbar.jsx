import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Mic, Users, BarChart3, Radio, Sparkles } from 'lucide-react';
import { apiService } from '../../services/api';

const Navbar = () => {
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
    { to: '/', label: 'Voice Studio', icon: Mic },
    { to: '/people-search', label: 'People Search', icon: Users },
    { to: '/responses', label: 'CRM Responses', icon: BarChart3 },
    { to: '/attendance', label: 'Staff Attendance', icon: Radio },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-dark-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:shadow-indigo-500/40 group-hover:scale-105">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                Hunar<span className="text-indigo-400">.AI</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 tracking-wide">
                Studio
              </span>
            </div>
          </NavLink>

          {/* Clean Modern Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-dark-900/60 p-1 rounded-2xl border border-white/[0.06] shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white/[0.09] text-white shadow-sm border border-white/[0.1]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                backendHealthy
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendHealthy ? 'bg-emerald-400 beacon-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{backendHealthy ? 'API Connected' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
