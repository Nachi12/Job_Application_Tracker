import { useJobsContext } from '../context/JobsContext';
import { useAuth } from '../hooks/useAuth';
import StatsCards from '../components/StatsCards';
import ApplicationsOverTimeChart from '../components/charts/ApplicationsOverTimeChart';
import StatusDistributionChart from '../components/charts/StatusDistributionChart';
import { SkeletonCard } from '../components/Skeleton';
import { exportJobsToCsv } from '../utils/csvExport';
import { Download, Plus, Sparkles, Briefcase, ChevronRight, CheckCircle2, ArrowUpRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { jobs = [], loading } = useJobsContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = jobs.length;
  const offers = jobs.filter((j) => j.status === 'Offer').length;
  const rejections = jobs.filter((j) => j.status === 'Rejected').length;
  const interviews = jobs.filter((j) => j.status === 'Interview' || j.status === 'Screening').length;

  const normalizedJobsForCharts = jobs.map((job) => ({
    ...job,
    company: job.companyName,
    dateApplied: job.appliedDate,
    status: job.status?.toUpperCase()
  }));

  return (
    <div className="space-y-6 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-violet-100 dark:border-haiti-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-haiti-900 dark:text-white tracking-tight">
              Good evening, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <span className="quantus-badge-turbo">COMMAND CENTER</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-haiti-300 font-medium mt-1">
            Here's what is happening with your job search today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {jobs.length > 0 && (
            <button
              onClick={() => exportJobsToCsv(jobs)}
              className="quantus-btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
            >
              <Download size={14} /> Export CSV
            </button>
          )}
          <button
            onClick={() => navigate('/intelligence')}
            className="quantus-btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-violet-500" /> ✦ Analyze Job
          </button>
          <button
            onClick={() => navigate('/applications')}
            className="quantus-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
          >
            <Plus size={15} /> Add Application
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : total === 0 ? (
        /* Compact Onboarding Card */
        <div className="quantus-card p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-violet-100 dark:border-haiti-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-500" />
                <h3 className="text-base font-extrabold text-haiti-900 dark:text-white">Start Your Job Search Command Center</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-haiti-300 mt-1 max-w-xl leading-relaxed">
                Track applications, analyze job descriptions with AI, and prepare smarter applications using HireLog OS.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/intelligence')}
                className="quantus-btn-secondary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Sparkles size={14} className="text-violet-500" /> Analyze a Job
              </button>
              <button
                onClick={() => navigate('/applications')}
                className="quantus-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Plus size={15} /> Add Application
              </button>
            </div>
          </div>

          {/* 3 Step Onboarding Row */}
          <div className="grid gap-4 md:grid-cols-3 pt-2">
            <div className="p-4 rounded-xl border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-900 space-y-2">
              <span className="text-xs font-black text-violet-500">01</span>
              <h4 className="text-xs font-bold text-haiti-900 dark:text-white">Add your first application</h4>
              <p className="text-[11px] text-slate-500 dark:text-haiti-300">Track target company, role, status, and salary in one place.</p>
            </div>
            <div className="p-4 rounded-xl border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-900 space-y-2">
              <span className="text-xs font-black text-violet-500">02</span>
              <h4 className="text-xs font-bold text-haiti-900 dark:text-white">Analyze target job description</h4>
              <p className="text-[11px] text-slate-500 dark:text-haiti-300">Get match scores, skill gap breakdowns, and keywords.</p>
            </div>
            <div className="p-4 rounded-xl border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-900 space-y-2">
              <span className="text-xs font-black text-violet-500">03</span>
              <h4 className="text-xs font-bold text-haiti-900 dark:text-white">Track & improve applications</h4>
              <p className="text-[11px] text-slate-500 dark:text-haiti-300">Generate cover letters, recruiter scripts, and prep for interviews.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <StatsCards
            total={total}
            offers={offers}
            rejections={rejections}
            interviews={interviews}
          />

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <ApplicationsOverTimeChart jobs={normalizedJobsForCharts as any} />
            <StatusDistributionChart jobs={normalizedJobsForCharts as any} />
          </div>

          {/* AI Insight Card */}
          <div className="quantus-card p-6 border-l-4 border-l-turbo-500 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-500" />
                <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white">
                  ✦ HireLog AI Search Recommendation
                </h3>
              </div>
              <span className="quantus-badge-turbo">INSIGHT</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-haiti-200 leading-relaxed">
              Your highest interview conversion rates occur when applications are submitted with targeted resume keywords. Ensure your primary resume is tailored for full-stack engineering roles before applying.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => navigate('/intelligence')}
                className="quantus-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Sparkles size={13} /> Run Job Analyzer
              </button>
              <button
                onClick={() => navigate('/resumes')}
                className="quantus-btn-secondary px-3.5 py-1.5 text-xs"
              >
                Manage Resumes
              </button>
            </div>
          </div>

          {/* Recent Applications High-Density List */}
          <div className="quantus-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white">Recent Application Pipeline</h3>
              <button
                onClick={() => navigate('/applications')}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:underline"
              >
                View All Applications <ChevronRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-violet-100 dark:divide-haiti-800 text-xs">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id || job.id}
                  onClick={() => navigate(`/applications/${job._id || job.id}`)}
                  className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-violet-50/50 dark:hover:bg-haiti-900/60 px-3 rounded-xl transition"
                >
                  <div>
                    <div className="font-extrabold text-haiti-900 dark:text-white">{job.role}</div>
                    <div className="text-slate-500 font-semibold">{job.companyName}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-violet-50 px-2.5 py-1 font-bold text-violet-600 dark:bg-haiti-800 dark:text-violet-300">
                      {job.status}
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      {new Date(job.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}