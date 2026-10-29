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
        className={`relative z-10 cursor-pointer rounded-lg border p-2 text-xs transition-colors hover:bg-[#FAF7F2] dark:hover:bg-[#11253A] ${
          isToday ? 'bg-[#F3ECDE] border-[#A9501C] text-[#A9501C] dark:bg-[#183451] dark:text-[#D4AF83]' : 'border-[#D4AF83]/30 dark:border-white/10'
        }`}
      >
        <div className="font-semibold">{d}</div>

        {jobsOnDate.length > 0 && (
          <div className="mt-1 text-[10px] font-bold text-[#A9501C] dark:text-[#D4AF83] pointer-events-none">
            {jobsOnDate.length} {jobsOnDate.length === 1 ? 'job' : 'jobs'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quantus-card p-5">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => onMonthChange(-1)}
          className="h-8 w-8 rounded-lg border border-[#D4AF83]/50 flex items-center justify-center text-xs hover:border-[#A9501C] hover:text-[#A9501C] transition"
        >
          ◀
        </button>

        <div className="font-serif font-bold text-base text-[#183451] dark:text-[#FAF7F2]">
          {safeBaseDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </div>

        <button
          onClick={() => onMonthChange(1)}
          className="h-8 w-8 rounded-lg border border-[#D4AF83]/50 flex items-center justify-center text-xs hover:border-[#A9501C] hover:text-[#A9501C] transition"
        >
          ▶
        </button>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wider text-[#183451]/60 dark:text-[#D4AF83]">
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