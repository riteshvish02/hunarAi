import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
        <Bot className="w-8 h-8 text-indigo-400" />
      </div>
      <h1 className="text-3xl font-black text-white">404 - Page Not Found</h1>
      <p className="text-xs text-slate-400 mt-2 max-w-sm">
        The route you requested does not exist in the Hunar.AI Hiring Assistant suite.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Voice Studio
      </Link>
    </div>
  );
};

export default NotFoundPage;
