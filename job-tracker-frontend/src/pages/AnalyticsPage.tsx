import { useJobs } from '../hooks/useJobs';
import ApplicationsOverTimeChart from '../components/charts/ApplicationsOverTimeChart';
import StatusDistributionChart from '../components/charts/StatusDistributionChart';

export default function AnalyticsPage() {
  const { jobs = [] } = useJobs();

  // 🔥 NORMALIZE DATA (CRITICAL FIX)
  const normalizedJobs = jobs.map((job) => ({
    ...job,

    // map backend → frontend enum
    status: job.status?.toUpperCase(),

    // ensure valid date
    appliedDate: job.appliedDate
      ? new Date(job.appliedDate).toISOString()
      : null,

    interviewDate: job.interviewDate
      ? new Date(job.interviewDate).toISOString()
      : null
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          See trends across all of your job applications.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ApplicationsOverTimeChart jobs={normalizedJobs} />
        <StatusDistributionChart jobs={normalizedJobs} />
      </div>
    </div>
  );
}