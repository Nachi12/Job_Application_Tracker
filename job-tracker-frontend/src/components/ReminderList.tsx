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
    <div className="rounded-xl border border-slate-200 bg-white/90 p-4 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-2 text-sm font-semibold">Upcoming deadlines</div>
      {upcoming.length === 0 ? (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          No upcoming deadlines. You are all caught up.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {upcoming.map(({ job, date }) => (
            <li key={job.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{job.role}</div>
                <div className="text-[11px] text-slate-500">
                  {job.company}
                </div>
              </div>
              <div className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-900 dark:bg-amber-900/70 dark:text-amber-100">
                {date.toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}