import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsService } from '../services/jobsService';
import { aiService } from '../services/aiService';
import { JobApplication, ApplicationEvent, CoverLetterResult, RecruiterMessageResult } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import {
  ArrowLeft,
  Building,
  MapPin,
  ExternalLink,
  Calendar,
  Sparkles,
  FileText,
  Mail
} from 'lucide-react';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pushToast } = useToastContext();

  const [job, setJob] = useState<JobApplication | null>(null);
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'overview' | 'ai_assistant' | 'timeline'>('overview');
  const [aiLoading, setAiLoading] = useState(false);

  // AI Generated States
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | null>(null);
  const [recruiterMsg, setRecruiterMsg] = useState<RecruiterMessageResult | null>(null);
  const [tailorResult, setTailorResult] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await jobsService.getById(id);
        setJob(data.job);
        setEvents(data.events || []);
      } catch (err) {
        pushToast('error', 'Failed to load application details');
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleGenerateCoverLetter = async () => {
    if (!job) return;
    setAiLoading(true);
    try {
      const res = await aiService.generateCoverLetter({
        companyName: job.companyName,
        role: job.role,
        jobDescription: job.jobDescription,
        applicationId: job._id || job.id
      });
      setCoverLetter(res);
      pushToast('success', 'Cover letter generated');
    } catch (e) {
      pushToast('error', 'Failed to generate cover letter');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateRecruiterMsg = async () => {
    if (!job) return;
    setAiLoading(true);
    try {
      const res = await aiService.generateRecruiterMessage({
        role: job.role,
        companyName: job.companyName,
        recruiterName: job.recruiterName
      });
      setRecruiterMsg(res);
      pushToast('success', 'Recruiter outreach generated');
    } catch (e) {
      pushToast('error', 'Failed to generate recruiter message');
    } finally {
      setAiLoading(false);
    }
  };

  const handleTailorResume = async () => {
    if (!job) return;
    if (!job.jobDescription) {
      pushToast('error', 'Please add a job description to tailor your resume.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await aiService.tailorResume(job.jobDescription);
      setTailorResult(res);
      pushToast('success', 'Resume tailoring suggestions ready');
    } catch (e) {
      pushToast('error', 'Failed to generate resume tailoring suggestions');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="quantus-btn-secondary text-xs flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Applications
        </button>
      </div>

      {/* Main Workspace Header */}
      <div className="quantus-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-haiti-900 dark:text-white tracking-tight">
              {job.role}
            </h1>
            <span className="quantus-badge-violet font-semibold">
              {job.status}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-haiti-300">
            <div className="flex items-center gap-1.5">
              <Building size={14} className="text-violet-500" />
              <span>{job.companyName}</span>
            </div>
            {job.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-violet-500" />
                <span>{job.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-violet-500" />
              <span>Applied {new Date(job.appliedDate).toLocaleDateString()}</span>
            </div>
            {job.jobLink && (
              <a
                href={job.jobLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline"
              >
                Job Posting <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* AI Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('ai_assistant');
              handleTailorResume();
            }}
            className="quantus-btn-primary text-xs flex items-center gap-1.5"
          >
            <Sparkles size={14} /> Tailor Resume
          </button>
          <button
            onClick={() => {
              setActiveTab('ai_assistant');
              handleGenerateCoverLetter();
            }}
            className="quantus-btn-secondary text-xs flex items-center gap-1.5"
          >
            <FileText size={14} /> Cover Letter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-violet-100 dark:border-haiti-800 flex gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-haiti-300'
          }`}
        >
          Overview & Description
        </button>
        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ai_assistant'
              ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-haiti-300'
          }`}
        >
          <Sparkles size={13} /> AI Application Workspace
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-2.5 transition border-b-2 ${
            activeTab === 'timeline'
              ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-haiti-300'
          }`}
        >
          Activity Timeline ({events.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            <div className="quantus-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-haiti-900 dark:text-white">
                Job Description
              </h3>
              {job.jobDescription ? (
                <div className="text-xs text-slate-700 dark:text-haiti-200 whitespace-pre-wrap leading-relaxed">
                  {job.jobDescription}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No job description provided yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="quantus-card p-4 space-y-3">
              <h3 className="text-xs font-bold text-haiti-900 dark:text-white uppercase tracking-wider">
                Key Meta Details
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500 dark:text-haiti-400">Employment Type</span>
                  <span className="font-semibold text-haiti-900 dark:text-white">{job.employmentType || 'Full-time'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500 dark:text-haiti-400">Salary Target</span>
                  <span className="font-semibold text-haiti-900 dark:text-white">{job.salary ? `$${job.salary.toLocaleString()}` : 'Not listed'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500 dark:text-haiti-400">Source</span>
                  <span className="font-semibold text-haiti-900 dark:text-white">{job.source || 'LinkedIn'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-violet-100 dark:border-haiti-800">
                  <span className="text-slate-500 dark:text-haiti-400">Recruiter</span>
                  <span className="font-semibold text-haiti-900 dark:text-white">{job.recruiterName || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai_assistant' && (
        <div className="space-y-6">
          {aiLoading && (
            <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-semibold">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
              <span>AI is analyzing application context...</span>
            </div>
          )}

          {/* AI Tailoring */}
          <div className="quantus-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-haiti-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" /> Targeted Resume Tailoring
                </h3>
                <p className="text-xs text-slate-500 dark:text-haiti-300">Grounded phrasing suggestions based on this specific job description.</p>
              </div>
              <button
                onClick={handleTailorResume}
                disabled={aiLoading}
                className="quantus-btn-secondary text-xs"
              >
                Generate Suggestions
              </button>
            </div>

            {tailorResult && (
              <div className="space-y-3 pt-2">
                {tailorResult.suggestions?.map((s: any, idx: number) => (
                  <div key={idx} className="rounded-lg border border-violet-100 bg-violet-50/40 p-3.5 dark:border-haiti-800 dark:bg-haiti-950/60 text-xs space-y-1.5">
                    <div className="text-slate-500 dark:text-haiti-400"><strong className="text-haiti-900 dark:text-white">Original:</strong> {s.original}</div>
                    <div className="text-violet-700 dark:text-violet-300 font-semibold"><strong className="text-haiti-900 dark:text-white">Suggested:</strong> {s.suggested}</div>
                    <div className="text-slate-400 dark:text-haiti-400 text-[11px]"><em>Rationale:</em> {s.rationale}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="quantus-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-haiti-900 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-violet-500" /> Tailored Cover Letter
                </h3>
                <p className="text-xs text-slate-500 dark:text-haiti-300">Concise role-specific application letter.</p>
              </div>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={aiLoading}
                className="quantus-btn-secondary text-xs"
              >
                Generate Letter
              </button>
            </div>

            {coverLetter && (
              <div className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 dark:border-haiti-800 dark:bg-haiti-950 text-xs space-y-3">
                <div className="font-bold text-haiti-900 dark:text-white">{coverLetter.subjectLine}</div>
                <div className="text-slate-700 dark:text-haiti-200">{coverLetter.salutation}</div>
                {coverLetter.bodyParagraphs?.map((p, i) => (
                  <p key={i} className="text-slate-700 dark:text-haiti-200 leading-relaxed">{p}</p>
                ))}
                <div className="text-slate-700 dark:text-haiti-200 whitespace-pre-line">{coverLetter.closing}</div>
              </div>
            )}
          </div>

          {/* Recruiter Outreach */}
          <div className="quantus-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-haiti-900 dark:text-white flex items-center gap-2">
                  <Mail size={16} className="text-violet-500" /> Recruiter Outreach Messages
                </h3>
                <p className="text-xs text-slate-500 dark:text-haiti-300">Ready-to-edit LinkedIn and email outreach scripts.</p>
              </div>
              <button
                onClick={handleGenerateRecruiterMsg}
                disabled={aiLoading}
                className="quantus-btn-secondary text-xs"
              >
                Generate Scripts
              </button>
            </div>

            {recruiterMsg && (
              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div className="rounded-lg border border-violet-100 bg-violet-50/40 p-3.5 dark:border-haiti-800 dark:bg-haiti-950 space-y-2">
                  <div className="font-bold text-violet-600 dark:text-violet-400">LinkedIn Note</div>
                  <p className="text-slate-700 dark:text-haiti-200">{recruiterMsg.linkedInMsg}</p>
                </div>
                <div className="rounded-lg border border-violet-100 bg-violet-50/40 p-3.5 dark:border-haiti-800 dark:bg-haiti-950 space-y-2">
                  <div className="font-bold text-violet-600 dark:text-violet-400">Recruiter Email</div>
                  <p className="text-slate-700 dark:text-haiti-200 whitespace-pre-line">{recruiterMsg.recruiterEmailMsg}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="quantus-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-haiti-900 dark:text-white">
            Application Activity History
          </h3>
          <div className="space-y-4 relative pl-4 border-l-2 border-violet-100 dark:border-haiti-800">
            {events.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-haiti-400">No recorded events yet.</p>
            ) : (
              events.map((ev) => (
                <div key={ev._id} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet-600 ring-4 ring-white dark:ring-haiti-900" />
                  <div className="text-xs font-bold text-haiti-900 dark:text-white">{ev.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-haiti-300">{ev.description}</div>
                  <div className="text-[10px] text-slate-400 dark:text-haiti-400">{new Date(ev.eventDate).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
