import React from 'react';
import { Bot, Check, Globe, Mic } from 'lucide-react';

const AgentCardList = ({ agents, selectedAgent, onSelectAgent }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            Hunar Voice AI Agents
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active neural voice agents configured for outbound talent acquisition and technical screening
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          {agents.length} Available Agents
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSelected = selectedAgent?.id === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`glass-panel p-5 cursor-pointer relative overflow-hidden transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-950/20'
                  : 'hover:border-white/[0.2]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/50">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Agent Logo & Persona */}
              <div className="flex items-center gap-3.5 mb-3.5">
                {agent.logo ? (
                  <img
                    src={agent.logo}
                    alt={agent.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/[0.1] shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-indigo-400 font-semibold">
                      Persona: {agent.persona_name || agent.voice_persona || 'AI'}
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-500" />
                      {agent.language}
                    </span>
                  </div>
                </div>
              </div>

              {/* Agent Summary */}
              <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {agent.summary || 'Voice agent specialized in candidate outreach, screening, and interview scheduling.'}
              </p>

              {/* Result Variables Pills */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                {agent.result_variables?.slice(0, 3).map((v) => (
                  <span
                    key={v}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                  >
                    {v.replace(/_/g, ' ')}
                  </span>
                ))}
                {agent.result_variables?.length > 3 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-500">
                    +{agent.result_variables.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentCardList;
