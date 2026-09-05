import React, { useState, useEffect } from 'react';
import { Users, ArrowRight, PhoneCall, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import JdInputForm from '../components/sourcing/JdInputForm';
import CriteriaBadges from '../components/sourcing/CriteriaBadges';
import CandidateList from '../components/sourcing/CandidateList';
import { apiService } from '../services/api';

const PeopleSearchPage = () => {
  const [jobDescription, setJobDescription] = useState(
    'Looking for a Senior DevOps Engineer with 5+ years of experience in Kubernetes, Docker, AWS infrastructure, Terraform, Helm, and CI/CD pipelines. Must have experience managing high-availability production clusters and monitoring with Prometheus/Grafana.'
  );
  const [targetRole, setTargetRole] = useState('Senior DevOps Engineer');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedCriteria, setExtractedCriteria] = useState({
    role_title: 'Senior DevOps & Full Stack Engineer',
    seniority: 'Senior',
    min_experience_years: 4,
    required_skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'React', 'Node.js', 'Python'],
    preferred_skills: ['CI/CD', 'FastAPI', 'Prometheus'],
    summary: 'Targeting Senior engineers with DevOps & Full Stack experience for high-concurrency cloud systems.',
    extracted_via: 'gemini',
  });
  const [candidates, setCandidates] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [recentCallAlert, setRecentCallAlert] = useState(null);

  // Load agents and candidates on mount so Ritesh & candidate profiles are immediately visible!
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingInitial(true);
      try {
        const [agentsRes, searchRes] = await Promise.all([
          apiService.getAgents(),
          apiService.searchCandidates({
            role_title: targetRole,
            required_skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Node.js'],
          }),
        ]);

        if (agentsRes.data) setAgents(agentsRes.data);
        if (searchRes.data?.candidates) setCandidates(searchRes.data.candidates);
      } catch (err) {
        console.error('Failed to load sourcing data:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle Gemini parsing + candidate re-scoring
  const handleAnalyzeAndSearch = async () => {
    if (!jobDescription.trim()) return;

    setAnalyzing(true);
    setRecentCallAlert(null);

    try {
      // Step 1: Parse JD with Gemini 2.5 Flash
      const parsedRes = await apiService.parseJd(jobDescription, targetRole);
      const criteria = parsedRes.data;
      setExtractedCriteria(criteria);

      // Step 2: Search matching candidates across Apollo/PDL criteria
      const searchRes = await apiService.searchCandidates({
        required_skills: criteria.required_skills,
        role_title: criteria.role_title,
        min_experience_years: criteria.min_experience_years,
      });

      setCandidates(searchRes.data?.candidates || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCallSuccess = (call) => {
    setRecentCallAlert(call);
  };

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
            People Search & Voice AI Reachout
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Input a Job Description, extract requirements using Google Gemini, match talent via Apollo/PDL, and launch automated Voice AI screening calls.
          </p>
        </div>

        <Link
          to="/responses"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-dark-900 border border-white/[0.1] text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all self-start md:self-auto"
        >
          View CRM Responses <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Call Confirmation Banner */}
      {recentCallAlert && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 to-indigo-950/50 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-200">
                Outbound Voice AI Call Initiated (Call ID: {recentCallAlert.id})
              </p>
              <p className="text-[11px] text-slate-400">
                Calling {recentCallAlert.callee_name} ({recentCallAlert.mobile_number}) with agent.
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all self-start sm:self-auto flex items-center gap-1.5"
          >
            Monitor in Voice Studio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Job Description Input Form */}
      <JdInputForm
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        targetRole={targetRole}
        setTargetRole={setTargetRole}
        onAnalyze={handleAnalyzeAndSearch}
        loading={analyzing}
      />

      {/* Extracted Gemini Criteria View */}
      {extractedCriteria && <CriteriaBadges criteria={extractedCriteria} />}

      {/* Candidate List (Automatically populated with Ritesh Vishwakarma at #1) */}
      {loadingInitial ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mr-2" />
          <span className="text-xs text-slate-400">Loading matching talent profiles...</span>
        </div>
      ) : (
        <CandidateList
          candidates={candidates}
          agents={agents}
          onCallSuccess={handleCallSuccess}
        />
      )}
    </div>
  );
};

export default PeopleSearchPage;
