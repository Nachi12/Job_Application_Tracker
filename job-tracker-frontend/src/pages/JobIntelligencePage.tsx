import { useState } from 'react';
import { aiService } from '../services/aiService';
import { JobAnalysisResult, MatchScoreResult } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import { Sparkles, CheckCircle2, AlertTriangle, Layers, Target, FileText, BookOpen } from 'lucide-react';
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
    <div className="space-y-5 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="border-b border-violet-100 dark:border-haiti-800 pb-4">
        <h1 className="text-xl font-bold text-haiti-900 dark:text-white tracking-tight">
          Job Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-haiti-300 font-normal mt-0.5">
          Understand a target role before you apply. Evaluate resume keyword alignment and skill gaps.
        </p>
      </div>

      {/* Input Panel */}
      <div className="quantus-card p-5 space-y-3">
        <label className="block text-xs font-semibold text-haiti-900 dark:text-white">
          Job Description
        </label>
        <textarea
          rows={5}
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste the target job description text here..."
          className="w-full rounded-lg border border-violet-200 bg-chalk p-3 text-xs font-normal text-haiti-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-hidden dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="quantus-btn-primary text-xs flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Analyze Role
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {analysis && matchScore && (
        <div className="space-y-5">
          {/* Analytical Score Bar */}
          <div className="quantus-card grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-violet-100 dark:divide-haiti-800">
            <div className="p-4 space-y-0.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Overall Match</div>
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400 tabular-nums">{matchScore.overallMatch}%</div>
              <p className="text-[10px] text-slate-400 font-normal">Parsed requirement fit</p>
            </div>
            <div className="p-4 space-y-0.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Technical Fit</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{matchScore.technicalScore}%</div>
              <p className="text-[10px] text-slate-400 font-normal">Stack alignment</p>
            </div>
            <div className="p-4 space-y-0.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Experience</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{matchScore.experienceScore}%</div>
              <p className="text-[10px] text-slate-400 font-normal">Seniority alignment</p>
            </div>
            <div className="p-4 space-y-0.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Education</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{matchScore.educationScore}%</div>
              <p className="text-[10px] text-slate-400 font-normal">Degree alignment</p>
            </div>
          </div>

          {/* AI Recommendation Box */}
          <div className="quantus-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="quantus-badge-turbo">✦ AI RECOMMENDATION</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-haiti-200 leading-relaxed font-normal bg-chalk dark:bg-haiti-950 p-3 rounded-lg border border-violet-100 dark:border-haiti-800">
              {matchScore.recommendation}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/resumes')}
                className="quantus-btn-primary text-xs flex items-center gap-1.5"
              >
                <FileText size={13} /> Tailor Resume
              </button>
              <button
                onClick={() => navigate('/interview-prep')}
                className="quantus-btn-secondary text-xs flex items-center gap-1.5"
              >
                <BookOpen size={13} /> Prepare Interview
              </button>
            </div>
          </div>

          {/* Skill Breakdown Grid */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="quantus-card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-haiti-900 dark:text-white flex items-center gap-1.5">
                <Target size={14} className="text-violet-500" /> Matched vs Missing Skills
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1.5">
                    <CheckCircle2 size={13} /> Matched ({matchScore.matchedSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {matchScore.matchedSkills?.map((s) => (
                      <span key={s} className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-violet-100 dark:border-haiti-800">
                  <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-1.5">
                    <AlertTriangle size={13} /> Skill Gaps ({matchScore.missingRequiredSkills?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {matchScore.missingRequiredSkills?.map((s) => (
                      <span key={s} className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="quantus-card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-haiti-900 dark:text-white flex items-center gap-1.5">
                <Layers size={14} className="text-violet-500" /> Extracted Requirements
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500">Experience</span>
                  <span className="font-semibold text-haiti-900 dark:text-white">{analysis.experienceRequired}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500">Education</span>
                  <span className="font-semibold text-haiti-900 dark:text-white">{analysis.educationRequired}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block mb-1">Key Responsibilities</span>
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
