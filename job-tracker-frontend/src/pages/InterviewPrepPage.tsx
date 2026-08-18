import { useState } from 'react';
import { aiService } from '../services/aiService';
import { InterviewQuestion } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import { BookOpen, Sparkles, HelpCircle, CheckCircle2, Award, Play } from 'lucide-react';

export default function InterviewPrepPage() {
  const { pushToast } = useToastContext();

  const [role, setRole] = useState('Full Stack Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion | null>(null);

  // Mock interview answer state
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const handleGenerateQuestions = async () => {
    if (!role) {
      pushToast('error', 'Please enter a target role.');
      return;
    }

    setLoading(true);
    try {
      const res = await aiService.generateInterviewPrep(role, jobDescription);
      setQuestions(res.questions || []);
      if (res.questions?.length) {
        setActiveQuestion(res.questions[0]);
      }
      pushToast('success', 'Generated interview prep questions');
    } catch (e) {
      pushToast('error', 'Failed to generate prep questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!activeQuestion || !userAnswer.trim()) {
      pushToast('error', 'Please type your answer before submitting.');
      return;
    }

    setEvaluating(true);
    try {
      const res = await aiService.evaluateMockAnswer(
        activeQuestion.question,
        userAnswer,
        activeQuestion.category
      );
      setEvalResult(res);
      pushToast('success', 'Mock interview response evaluated');
    } catch (e) {
      pushToast('error', 'Failed to evaluate answer');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
          <BookOpen className="text-indigo-600 dark:text-indigo-400" size={22} /> Interview Preparation & Mock Workspace
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate role-specific interview questions, review model guidance, and practice in Mock Interview Mode.
        </p>
      </div>

      {/* Generator Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Optional Job Description
            </label>
            <input
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description snippet for context..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating Prep...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Generate Questions & Guidance
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Questions & Mock Interface */}
      {questions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Question List Sidebar */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Generated Questions ({questions.length})
            </h3>
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setActiveQuestion(q);
                  setUserAnswer('');
                  setEvalResult(null);
                }}
                className={`w-full text-left p-3 rounded-lg border text-xs transition ${
                  activeQuestion?.id === q.id
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-600">{q.category}</span>
                </div>
                <div className="line-clamp-2">{q.question}</div>
              </button>
            ))}
          </div>

          {/* Active Question & Mock Practice */}
          <div className="md:col-span-2 space-y-5">
            {activeQuestion && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {activeQuestion.category} Question
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {activeQuestion.question}
                </h2>

                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-950/40 text-xs space-y-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-indigo-600" /> Answer Guidance Strategy
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{activeQuestion.guidance}</p>
                </div>

                {/* Mock Practice Form */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Play size={13} className="text-emerald-600" /> Practice Answer (Mock Interview Mode)
                  </h3>
                  <textarea
                    rows={5}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your response to this interview question..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={evaluating}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {evaluating ? 'Evaluating Answer...' : 'Evaluate Answer'}
                    </button>
                  </div>
                </div>

                {/* Evaluation Feedback */}
                {evalResult && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 text-xs space-y-3 pt-4 border-t-2 border-t-emerald-500">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Award size={16} className="text-amber-500" /> AI Mock Feedback
                      </div>
                      <div className="text-sm font-extrabold text-emerald-600">Score: {evalResult.overallScore}/100</div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{evalResult.summary}</p>
                    <div className="grid gap-2 md:grid-cols-2 pt-2">
                      <div className="space-y-1">
                        <div className="font-semibold text-emerald-600">Key Strengths</div>
                        {evalResult.strengths?.map((s: string, i: number) => (
                          <div key={i} className="text-slate-600 dark:text-slate-400">• {s}</div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-amber-600">Areas to Improve</div>
                        {evalResult.areasToImprove?.map((a: string, i: number) => (
                          <div key={i} className="text-slate-600 dark:text-slate-400">• {a}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
