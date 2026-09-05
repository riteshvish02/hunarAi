import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import AgentCardList from '../components/voice/AgentCardList';
import VoiceCallTrigger from '../components/voice/VoiceCallTrigger';
import LiveCallMonitor from '../components/voice/LiveCallMonitor';
import CallHistoryMini from '../components/voice/CallHistoryMini';
import { apiService } from '../services/api';

const VoiceStudioPage = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [calls, setCalls] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [agentsRes, callsRes] = await Promise.all([
          apiService.getAgents(),
          apiService.listCalls({ page_size: 20 }),
        ]);

        const agentList = agentsRes.data || [];
        setAgents(agentList);
        if (agentList.length > 0) {
          setSelectedAgent(agentList[0]);
        }

        const callList = callsRes.data?.results || [];
        setCalls(callList);
        if (callList.length > 0) {
          setActiveCall(callList[0]);
        }
      } catch (err) {
        console.error('Failed to load initial studio data:', err);
        setError('Failed to connect to backend server. Make sure the backend on :5000 is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Background real-time sync for call list every 3.5s
  useEffect(() => {
    const pollCalls = async () => {
      try {
        const callsRes = await apiService.listCalls({ page_size: 20 });
        const callList = callsRes.data?.results || [];
        if (callList.length > 0) {
          setCalls(callList);
          setActiveCall((prev) => {
            if (!prev) return callList[0];
            const updated = callList.find(
              (c) => (c.id || c.callId) === (prev.id || prev.callId)
            );
            return updated ? { ...prev, ...updated } : prev;
          });
        }
      } catch (err) {
        // silent background poll
      }
    };

    const interval = setInterval(pollCalls, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleCallInitiated = (newCall) => {
    setActiveCall(newCall);
    setCalls((prev) => [newCall, ...prev]);
  };

  const handleCallUpdate = (updatedCall) => {
    setActiveCall(updatedCall);
    const id = updatedCall.id || updatedCall.callId;
    setCalls((prev) =>
      prev.map((c) => ((c.id || c.callId) === id ? { ...c, ...updatedCall } : c))
    );
  };

  const handleSelectCall = (call) => {
    setActiveCall(call);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
        <p className="text-sm text-slate-300 font-semibold">Loading Hunar Voice AI Agents...</p>
        <p className="text-xs text-slate-500 mt-1">Connecting to Hunar Gateway</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 max-w-xl mx-auto my-12 text-center">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <h3 className="text-base font-bold text-rose-300">Connection Error</h3>
        <p className="text-xs text-slate-400 mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Voice Agents Catalog */}
      <AgentCardList
        agents={agents}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
      />

      {/* Main Two-Column Interaction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Call Trigger Form & Quick Logs */}
        <div className="lg:col-span-6 space-y-6">
          <VoiceCallTrigger
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
            onCallInitiated={handleCallInitiated}
          />
          <CallHistoryMini
            calls={calls}
            onSelectCall={handleSelectCall}
            selectedCallId={activeCall?.id || activeCall?.callId}
          />
        </div>

        {/* Right Column: Live Telemetry, Waveform & Extracted Answers */}
        <div className="lg:col-span-6">
          <div className="sticky top-20">
            <LiveCallMonitor activeCall={activeCall} onRefresh={handleCallUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceStudioPage;
