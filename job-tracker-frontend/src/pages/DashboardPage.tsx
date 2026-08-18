import { useJobsContext } from '../context/JobsContext';
import { useAuth } from '../hooks/useAuth';
import StatsCards from '../components/StatsCards';
import ApplicationsOverTimeChart from '../components/charts/ApplicationsOverTimeChart';
import StatusDistributionChart from '../components/charts/StatusDistributionChart';
import { SkeletonCard } from '../components/Skeleton';
import { exportJobsToCsv } from '../utils/csvExport';
import { Download, Plus, Sparkles, ChevronRight } from 'lucide-react';
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
    <div className="space-y-5 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-violet-100 dark:border-haiti-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-haiti-900 dark:text-white tracking-tight">
            Job Search
          </h1>
          <p className="text-xs text-slate-500 dark:text-haiti-300 font-normal mt-0.5">
            Overview of your active application pipeline and response metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {jobs.length > 0 && (
            <button
              onClick={() => exportJobsToCsv(jobs)}
              className="quantus-btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={14} /> Export CSV
            </button>
          )}
          <button
            onClick={() => navigate('/intelligence')}
            className="quantus-btn-secondary text-xs flex items-center gap-1.5"
          >
            Analyze Job
          </button>
          <button
            onClick={() => navigate('/applications')}
            className="quantus-btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Application
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
        <div className="quantus-card p-6 space-y-4">
          <div className="border-b border-violet-100 dark:border-haiti-800 pb-4">
            <h3 className="text-sm font-bold text-haiti-900 dark:text-white">Start Your Job Search</h3>
            <p className="text-xs text-slate-500 dark:text-haiti-300 mt-1">
              Track applications, analyze target job descriptions, and organize interview prep.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="p-3.5 rounded-lg border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-950 space-y-1">
              <span className="text-xs font-bold text-violet-500">01</span>
              <h4 className="text-xs font-semibold text-haiti-900 dark:text-white">Add Application</h4>
              <p className="text-[11px] text-slate-500">Store role, company, salary, and date.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-950 space-y-1">
              <span className="text-xs font-bold text-violet-500">02</span>
              <h4 className="text-xs font-semibold text-haiti-900 dark:text-white">Analyze Job Fit</h4>
              <p className="text-[11px] text-slate-500">Identify technical skill gaps.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-950 space-y-1">
              <span className="text-xs font-bold text-violet-500">03</span>
              <h4 className="text-xs font-semibold text-haiti-900 dark:text-white">Track Progress</h4>
              <p className="text-[11px] text-slate-500">Move applications through Kanban stages.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Metrics Bar */}
          <StatsCards
            total={total}
            offers={offers}
            rejections={rejections}
            interviews={interviews}
          />

          {/* Quiet AI Insight Section */}
          <div className="quantus-card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="quantus-badge-turbo">✦ AI INSIGHT</span>
              <p className="text-xs text-slate-700 dark:text-haiti-200 font-medium">
                Your highest interview conversion rates occur when applications are submitted with targeted technical skills.
              </p>
            </div>
            <button
              onClick={() => navigate('/intelligence')}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline shrink-0"
            >
              Analyze Job
            </button>
          </div>

          {/* Charts Row */}
          <div className="grid gap-5 md:grid-cols-2">
            <ApplicationsOverTimeChart jobs={normalizedJobsForCharts as any} />
            <StatusDistributionChart jobs={normalizedJobsForCharts as any} />
          </div>

          {/* Recent Applications Table */}
          <div className="quantus-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-violet-100 dark:border-haiti-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-haiti-900 dark:text-white">Recent Applications</h3>
              <button
                onClick={() => navigate('/applications')}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-0.5 hover:underline"
              >
                View All <ChevronRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-violet-100 dark:divide-haiti-800 text-xs">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id || job.id}
                  onClick={() => navigate(`/applications/${job._id || job.id}`)}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-violet-50/50 dark:hover:bg-haiti-900/60 px-2 rounded-lg transition"
                >
                  <div>
                    <span className="font-semibold text-haiti-900 dark:text-white">{job.role}</span>
                    <span className="text-slate-400 font-normal ml-2">at {job.companyName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:bg-haiti-800 dark:text-violet-300">
                      {job.status}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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