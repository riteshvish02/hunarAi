import React, { useState } from 'react';
import { Radio, Phone, Bot, CheckCircle2, ShieldCheck, MapPin, Users, Cpu, FileText, Play } from 'lucide-react';

const AttendanceSystemPage = () => {
  const [activeLocation, setActiveLocation] = useState('Location #12 - Pune Warehouse');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState([
    { time: '08:55 AM', emp: 'Rajesh Kumar (EMP-4102)', loc: 'Site #12 (Pune)', method: 'IVR Voice AI Check-in', status: 'VERIFIED' },
    { time: '08:58 AM', emp: 'Anita Sharma (EMP-1089)', loc: 'Site #03 (Bhiwandi)', method: 'Missed Call + USSD', status: 'VERIFIED' },
    { time: '09:02 AM', emp: 'Vikram Singh (EMP-8821)', loc: 'Site #45 (Manesar)', method: 'Voice AI Biometric', status: 'VERIFIED' },
  ]);

  const runSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      const newLog = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emp: 'Ritesh Vishwakarma (EMP-7719)',
        loc: activeLocation,
        method: 'Toll-Free Voice AI Agent (Hunar)',
        status: 'VERIFIED BY LLM',
      };
      setLogs((prev) => [newLog, ...prev]);
      setSimulationRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            Assignment Part 3 • System Design Solution
          </span>
        </div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Radio className="w-6 h-6 text-cyan-400" />
          Attendance System for 1000 Staff across 100 Sites (No Smartphones)
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          <strong>Problem Statement:</strong> If there were no smartphones but LLMs exist/everything else exists except apps, and you are an HR who has to track attendance of 1000 people everyday in 100 locations, what would you do?
        </p>
      </div>

      {/* Architectural Solution Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 border-t-2 border-t-cyan-500">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
            <Phone className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-sm font-bold text-white">1. Toll-Free Voice AI Agent (Hunar)</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Workers dial a single Toll-Free Number from basic feature phones (Nokia/JioPhone) or on-site landlines. A Hunar Voice AI agent answers in local languages (Hindi, Marathi, Tamil, etc.), asks for their Employee PIN, and verifies voice biometrics.
          </p>
        </div>

        <div className="glass-panel p-5 border-t-2 border-t-indigo-500">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-white">2. Telecom Cell-Tower Triangulation</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Without GPS apps, location is verified via Telecom Carrier Cell-ID / LBS (Location Based Services) during the call to ensure the employee is physically present within the 100 on-site geo-radius.
          </p>
        </div>

        <div className="glass-panel p-5 border-t-2 border-t-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">3. LLM Anomaly & Verification Engine</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            The LLM parses voice tone, detects proxy check-ins, aggregates real-time roster for all 100 sites, and triggers proactive outbound calls (`Missed Check-In Reminder`) if an employee hasn't clocked in by 9:15 AM.
          </p>
        </div>
      </div>

      {/* Interactive Simulator Panel */}
      <div className="glass-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-cyan-400" />
              Live Interactive Voice Check-In Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate an employee calling the Voice AI Attendance line from an offline job site
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={activeLocation}
              onChange={(e) => setActiveLocation(e.target.value)}
              className="bg-dark-950/80 border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Location #12 - Pune Warehouse">Location #12 - Pune Warehouse</option>
              <option value="Location #03 - Bhiwandi Logistics Hub">Location #03 - Bhiwandi Hub</option>
              <option value="Location #45 - Manesar Plant">Location #45 - Manesar Plant</option>
              <option value="Location #88 - Chennai Distribution Center">Location #88 - Chennai Center</option>
            </select>

            <button
              onClick={runSimulation}
              disabled={simulationRunning}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Phone className="w-3.5 h-3.5" />
              {simulationRunning ? 'Verifying with LLM...' : 'Simulate Employee Call'}
            </button>
          </div>
        </div>

        {/* Real-Time Roster Logs */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Central Attendance Roster Stream (100 Locations Active)
          </span>
          {logs.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-dark-950/70 border border-white/[0.05] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 text-[11px]">{item.time}</span>
                <span className="font-bold text-slate-200">{item.emp}</span>
                <span className="text-slate-400 text-[11px]">at {item.loc}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded">
                  {item.method}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystemPage;
