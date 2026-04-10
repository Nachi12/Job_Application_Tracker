import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { JobApplication, JobStatus } from '../../types/models';
import { JOB_STATUS_LABELS } from '../../utils/constants';

interface Props {
  jobs: JobApplication[];
}

const COLORS = ['#01696f', '#0c4e54', '#22c55e', '#ef4444'];

export default function StatusDistributionChart({ jobs }: Props) {
  const counts: Record<JobStatus, number> = {
    APPLIED: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0
  };

  jobs.forEach((j) => {
    counts[j.status] += 1;
  });

  const data = (Object.keys(counts) as JobStatus[])
    .filter((status) => counts[status] > 0)
    .map((status) => ({
      name: JOB_STATUS_LABELS[status],
      value: counts[status]
    }));

  return (
    <div className="h-72 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-2 text-sm font-semibold">Status distribution</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}