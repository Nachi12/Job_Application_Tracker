import { JobApplication } from '../types/models';

interface Props {
  jobs: JobApplication[];
  baseDate: Date;
  onMonthChange: (offset: number) => void;
}

export default function CalendarView({ jobs = [], baseDate, onMonthChange }: Props) {
  // ✅ SAFE DATE
  const safeBaseDate =
    baseDate instanceof Date && !isNaN(baseDate.getTime())
      ? baseDate
      : new Date();

  const year = safeBaseDate.getFullYear();
  const month = safeBaseDate.getMonth();

  // ✅ FORMAT DATE SAFELY
  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
  };

  // ✅ NORMALIZE JOBS
  const normalizedJobs = jobs.map((job) => ({
    ...job,
    appliedDate: job.appliedDate
      ? formatDate(new Date(job.appliedDate))
      : null
  }));

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  const today = formatDate(new Date());

  const handleDateClick = (date: string | null) => {
    if (!date) return;

    const jobsOnDate = normalizedJobs.filter(
      (j) => j.appliedDate === date
    );

    console.log('CLICKED:', date);
    alert(`Date: ${date}\nJobs: ${jobsOnDate.length}`);
  };

  const days = [];

  // EMPTY CELLS
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${year}-${month}-${i}`} />);
  }

  // REAL DAYS
  for (let d = 1; d <= daysInMonth; d++) {
    const rawDate = new Date(year, month, d);
    const date = formatDate(rawDate);

    const jobsOnDate = normalizedJobs.filter(
      (j) => j.appliedDate === date
    );

    const isToday = date === today;

    days.push(
      <div
        key={`day-${year}-${month}-${d}`}
        onClick={(e) => {
          e.stopPropagation();
          handleDateClick(date);
        }}
        className={`relative z-10 cursor-pointer rounded-lg border p-2 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 ${
          isToday ? 'bg-blue-100 dark:bg-blue-900' : ''
        }`}
      >
        <div className="font-semibold">{d}</div>

        {jobsOnDate.length > 0 && (
          <div className="mt-1 text-[10px] text-blue-600 pointer-events-none">
            {jobsOnDate.length} job
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => onMonthChange(-1)}>◀</button>

        <div className="font-semibold">
          {safeBaseDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </div>

        <button onClick={() => onMonthChange(1)}>▶</button>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <div key={`weekday-${i}`}>{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div className="mt-2 grid grid-cols-7 gap-2 relative z-10">
        {days}
      </div>
    </div>
  );
}