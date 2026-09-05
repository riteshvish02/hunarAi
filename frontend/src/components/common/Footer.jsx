import React from 'react';
import { Bot, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-dark-950/80 backdrop-blur-md py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-600/20 flex items-center justify-center">
            <Bot className="w-3 h-3 text-indigo-400" />
          </div>
          <span className="font-semibold text-slate-400">Hunar.AI Hiring Assistant & Voice Sourcing Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Voice Gateway Active
          </span>
          <span className="text-slate-600">•</span>
          <span>Hunar Assignment 2026</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
