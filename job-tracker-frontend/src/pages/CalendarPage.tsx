import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import CalendarView from '../components/CalendarView';
import ReminderList from '../components/ReminderList';

export default function CalendarPage() {
  const { jobs = [] } = useJobs();

  const [baseDate, setBaseDate] = useState<Date>(new Date());

  const handleMonthChange = (offset: number) => {
    setBaseDate((prev) => {
      const safe = prev instanceof Date ? prev : new Date();
      const d = new Date(safe);
      d.setMonth(d.getMonth() + offset);
      return d;
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <CalendarView
        jobs={jobs}
        baseDate={baseDate || new Date()}
        onMonthChange={handleMonthChange}
      />
      <ReminderList jobs={jobs} />
    </div>
  );
}