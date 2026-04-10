import { useJobs } from '../hooks/useJobs';
import StatsCards from '../components/StatsCards';
import ApplicationsOverTimeChart from '../components/charts/ApplicationsOverTimeChart';
import StatusDistributionChart from '../components/charts/StatusDistributionChart';
import { SkeletonCard } from '../components/Skeleton';

export default function DashboardPage() {
  const { jobs = [], loading } = useJobs();

  // 🔥 NORMALIZE DATA (CRITICAL FIX)
  const normalizedJobs = jobs.map((job) => ({
    ...job,
    status: job.status?.toUpperCase(), // Applied → APPLIED
    appliedDate: job.appliedDate
      ? new Date(job.appliedDate).toISOString()
      : null
  }));

  const total = normalizedJobs.length;
  const offers = normalizedJobs.filter((j) => j.status === 'OFFER').length;
  const rejections = normalizedJobs.filter((j) => j.status === 'REJECTED').length;
  const interviews = normalizedJobs.filter((j) => j.status === 'INTERVIEW').length;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <StatsCards
          total={total}
          offers={offers}
          rejections={rejections}
          interviews={interviews}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ApplicationsOverTimeChart jobs={normalizedJobs} />
        <StatusDistributionChart jobs={normalizedJobs} />
      </div>
    </div>
  );
}