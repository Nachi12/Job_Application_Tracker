import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { JobApplication, JobStatus } from '../../types/models';
import { JOB_STATUS_LABELS } from '../../utils/constants';

interface Props {
  jobs: JobApplication[];
}

const COLORS = ['#834DFB', '#3B82F6', '#F0E100', '#10B981', '#F43F5E', '#A897D8'];

export default function StatusDistributionChart({ jobs }: Props) {
  const counts: Record<string, number> = {
    Saved: 0,
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
  };

  (jobs || []).forEach((j) => {
    const s = j.status || 'Applied';
    counts[s] = (counts[s] || 0) + 1;
  });

  const data = Object.keys(counts)
    .filter((status) => counts[status] > 0)
    .map((status) => ({
      name: JOB_STATUS_LABELS[status as JobStatus] || status,
      value: counts[status]
    }));

  return (
    <div className="quantus-card p-5 h-80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-haiti-900 dark:text-white">
          Pipeline Status Distribution
        </h3>
        <span className="quantus-badge-turbo">Share</span>
      </div>

      <div className="w-full h-64">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No pipeline status data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18102B',
                  borderColor: '#834DFB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                  padding: '8px 12px'
                }}
                itemStyle={{
                  color: '#F5F3FF',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
                labelStyle={{
                  color: '#F0E100',
                  fontSize: '12px',
                  fontWeight: '800'
                }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}