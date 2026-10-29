import { JobApplication } from '../types/models';

interface Props {
  jobs: JobApplication[];
}

export default function ReminderList({ jobs }: Props) {
  const today = new Date();
  const upcoming = jobs
    .filter((job) => job.deadlineDate)
    .map((job) => ({
      job,
      date: new Date(job.deadlineDate as string)
    }))
    .filter(({ date }) => date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="quantus-card p-4 text-xs space-y-3">
      <div className="text-sm font-bold text-haiti-900 dark:text-white">Upcoming deadlines</div>
      {upcoming.length === 0 ? (
        <div className="text-xs text-slate-500 dark:text-haiti-300">
          No upcoming deadlines. You are all caught up.
        </div>
      ) : (
        <ul className="space-y-2">
          {upcoming.map(({ job, date }) => (
            <li key={job.id || job._id} className="flex items-center justify-between border-b border-violet-50 dark:border-haiti-800/50 pb-1.5 last:border-0 last:pb-0">
              <div>
                <div className="font-semibold text-haiti-900 dark:text-white">{job.role}</div>
                <div className="text-[11px] text-slate-500 dark:text-haiti-300">
                  {job.companyName || (job as any).company}
                </div>
              </div>
              <div className="quantus-badge-turbo text-[10px]">
                {date.toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}