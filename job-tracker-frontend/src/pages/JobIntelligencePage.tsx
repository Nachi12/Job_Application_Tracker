import { useState } from 'react';
import { aiService } from '../services/aiService';
import { JobAnalysisResult, MatchScoreResult } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import { Sparkles, CheckCircle2, AlertTriangle, Layers, Target, ArrowRight, Zap, FileText, BookOpen, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JobIntelligencePage() {
  const { pushToast } = useToastContext();
  const navigate = useNavigate();

  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(null);
  const [matchScore, setMatchScore] = useState<MatchScoreResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobText || jobText.length < 20) {
      pushToast('error', 'Please enter a job description of at least 20 characters.');
      return;
    }

    setLoading(true);
    try {
      const [analysisRes, matchRes] = await Promise.all([
        aiService.analyzeJob(jobText),
        aiService.evaluateMatch(jobText)
      ]);
      setAnalysis(analysisRes);
      setMatchScore(matchRes);
      pushToast('success', 'Job description analyzed successfully');
    } catch (e: any) {
      pushToast('error', 'Failed to analyze job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Hero Header */}
      <div className="border-b border-violet-100 dark:border-haiti-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-haiti-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-violet-500" size={24} /> Job Intelligence Suite
          </h1>
          <span className="quantus-badge-turbo">AI OPERATING SYSTEM</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-haiti-300 font-medium mt-1">
          Analyze a job before you apply. Evaluate your resume match alignment and identify critical skill gaps.
        </p>
      </div>

      {/* Input Card */}
      <div className="quantus-card p-6 space-y-4">
        <label className="block text-xs font-bold text-haiti-900 dark:text-white uppercase tracking-wider">
          Paste Target Job Description
        </label>
        <textarea
          rows={6}
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste the complete job description text here to run AI match score and skill gap analysis..."
          className="w-full rounded-xl border border-violet-200 bg-chalk p-4 text-xs font-medium text-haiti-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-hidden dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="quantus-btn-primary px-5 py-2.5 text-xs flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing Job Intelligence...
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-turbo-500 fill-turbo-500" /> Analyze Job & Match Fit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {analysis && matchScore && (
        <div className="space-y-6">
          {/* Match Score Scorecards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="quantus-card p-5 space-y-2 border-l-4 border-l-violet-500">
              <div className="text-[11px] font-bold text-slate-500 dark:text-haiti-300 uppercase tracking-wider">Overall Match</div>
              <div className="text-3xl font-black text-violet-600 dark:text-violet-400 tabular-nums">{matchScore.overallMatch}%</div>
              <p className="text-[10px] text-slate-400">Parsed requirement fit</p>
            </div>
            <div className="quantus-card p-5 space-y-2 border-l-4 border-l-blue-500">
              <div className="text-[11px] font-bold text-slate-500 dark:text-haiti-300 uppercase tracking-wider">Technical Skills</div>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">{matchScore.technicalScore}%</div>
              <p className="text-[10px] text-slate-400">Stack alignment</p>
            </div>
            <div className="quantus-card p-5 space-y-2 border-l-4 border-l-amber-500">
              <div className="text-[11px] font-bold text-slate-500 dark:text-haiti-300 uppercase tracking-wider">Experience Fit</div>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{matchScore.experienceScore}%</div>
              <p className="text-[10px] text-slate-400">Seniority alignment</p>
            </div>
            <div className="quantus-card p-5 space-y-2 border-l-4 border-l-emerald-500">
              <div className="text-[11px] font-bold text-slate-500 dark:text-haiti-300 uppercase tracking-wider">Education Fit</div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{matchScore.educationScore}%</div>
              <p className="text-[10px] text-slate-400">Degree alignment</p>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="quantus-card p-6 border-l-4 border-l-turbo-500 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-500" />
                <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white">✦ HireLog AI Analysis & Recommendation</h3>
              </div>
              <span className="quantus-badge-turbo">RECOMMENDATION</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-haiti-200 leading-relaxed font-medium bg-chalk dark:bg-haiti-950 p-4 rounded-xl border border-violet-100 dark:border-haiti-800">
              {matchScore.recommendation}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => navigate('/resumes')}
                className="quantus-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
              >
                <FileText size={13} /> Tailor Resume
              </button>
              <button
                onClick={() => navigate('/interview-prep')}
                className="quantus-btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
              >
                <BookOpen size={13} /> Prepare Interview
              </button>
            </div>
          </div>

          {/* Skill Breakdown Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="quantus-card p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white flex items-center gap-2">
                <Target size={16} className="text-violet-500" /> Matched vs Missing Skills
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 size={14} /> Strong Skills Matched ({matchScore.matchedSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchScore.matchedSkills?.map((s) => (
                      <span key={s} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-violet-100 dark:border-haiti-800">
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle size={14} /> Skill Gaps Identified ({matchScore.missingRequiredSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchScore.missingRequiredSkills?.map((s) => (
                      <span key={s} className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="quantus-card p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white flex items-center gap-2">
                <Layers size={16} className="text-violet-500" /> Extracted Requirements
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500">Experience Required</span>
                  <span className="font-bold text-haiti-900 dark:text-white">{analysis.experienceRequired}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500">Education Required</span>
                  <span className="font-bold text-haiti-900 dark:text-white">{analysis.educationRequired}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Key Responsibilities</span>
                  <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-haiti-200">
                    {analysis.keyResponsibilities?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
