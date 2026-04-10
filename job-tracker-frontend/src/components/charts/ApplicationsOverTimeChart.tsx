import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { JobApplication } from '../../types/models';

interface Props {
  jobs: JobApplication[];
}

export default function ApplicationsOverTimeChart({ jobs }: Props) {
  const countsByDate: Record<string, number> = {};
  const safeJobs = jobs || [];

safeJobs.forEach((job) => {
  if (!job?.appliedDate) return; // 🔥 PREVENT CRASH

  const date = new Date(job.appliedDate)
    .toISOString()
    .slice(0, 10);
});
  const data = Object.entries(countsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return (
    <div className="h-72 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-2 text-sm font-semibold">Applications over time</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#01696f"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}