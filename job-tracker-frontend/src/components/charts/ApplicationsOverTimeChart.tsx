import {
  AreaChart,
  Area,
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
    const rawDate = job.appliedDate || (job as any).dateApplied;
    if (!rawDate) return;
    try {
      const date = new Date(rawDate).toISOString().slice(0, 10);
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    } catch (e) {
      // ignore invalid date
    }
  });

  const data = Object.entries(countsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      count
    }));

  return (
    <div className="quantus-card p-5 h-80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-haiti-900 dark:text-white">
          Application Activity Over Time
        </h3>
        <span className="quantus-badge-turbo">Trend</span>
      </div>

      <div className="w-full h-64">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No date data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#834DFB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#834DFB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200/60 dark:stroke-haiti-800" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#834DFB' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#834DFB' }} />
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
              <Area
                type="monotone"
                dataKey="count"
                stroke="#834DFB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#violetGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}