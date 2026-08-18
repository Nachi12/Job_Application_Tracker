import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobApplication, JobStatus } from '../types/models';
import { Calendar, MapPin, Building } from 'lucide-react';

interface Props {
  jobs: JobApplication[];
  onStatusChange: (id: string, status: JobStatus) => void;
}

const COLUMNS: { key: JobStatus; label: string; headerBadgeClass: string }[] = [
  { key: 'Saved', label: 'Saved', headerBadgeClass: 'bg-slate-200 text-slate-700 dark:bg-haiti-800 dark:text-haiti-200' },
  { key: 'Applied', label: 'Applied', headerBadgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200' },
  { key: 'Screening', label: 'Screening', headerBadgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' },
  { key: 'Interview', label: 'Interview', headerBadgeClass: 'bg-violet-500 text-white font-semibold' },
  { key: 'Offer', label: 'Offer', headerBadgeClass: 'bg-turbo-500 text-haiti-900 font-bold' },
  { key: 'Rejected', label: 'Closed', headerBadgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200' }
];

export default function KanbanBoard({ jobs = [], onStatusChange }: Props) {
  const navigate = useNavigate();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeOverCol, setActiveOverCol] = useState<JobStatus | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, jobId: string) => {
    setDraggedId(jobId);
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, colKey: JobStatus) => {
    e.preventDefault();
    if (activeOverCol !== colKey) {
      setActiveOverCol(colKey);
    }
  };

  const handleDragLeave = () => {
    setActiveOverCol(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: JobStatus) => {
    e.preventDefault();
    setActiveOverCol(null);
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      onStatusChange(id, status);
    }
    setDraggedId(null);
  };

  return (
    <div className="flex overflow-x-auto gap-3.5 pb-6 min-h-[580px] snap-x">
      {COLUMNS.map((col) => {
        const columnJobs = jobs.filter((j) => (j.status || 'Applied') === col.key);
        const isTarget = activeOverCol === col.key;

        return (
          <div
            key={col.key}
            onDrop={(e) => handleDrop(e, col.key)}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            className={`flex flex-col w-72 min-w-[270px] rounded-xl border p-3 transition-all duration-150 bg-white/70 dark:bg-haiti-900/60 border-violet-100 dark:border-haiti-800 snap-start shrink-0 ${
              isTarget ? 'ring-1 ring-violet-500 border-violet-500' : ''
            }`}
          >
            {/* Column Header */}
            <div className="mb-2.5 flex items-center justify-between px-1">
              <div className="font-bold text-xs text-haiti-900 dark:text-white">
                {col.label}
              </div>
              <span className={`flex h-4 min-w-[20px] px-1.5 items-center justify-center rounded-md text-[10px] ${col.headerBadgeClass}`}>
                {columnJobs.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto max-h-[660px] pr-0.5">
              {columnJobs.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-violet-200 dark:border-haiti-800 p-4 text-center">
                  <p className="text-[11px] text-slate-400 dark:text-haiti-300 font-normal">Empty</p>
                </div>
              ) : (
                columnJobs.map((job) => {
                  const jobId = job._id || job.id;
                  return (
                    <div
                      key={jobId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, jobId)}
                      onClick={() => navigate(`/applications/${jobId}`)}
                      className="group cursor-pointer quantus-card p-3 space-y-1.5 relative border-l-2 border-l-violet-500 hover:border-violet-400"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-xs text-haiti-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 line-clamp-1">
                          {job.role}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-haiti-200 font-normal">
                        <Building size={11} className="text-violet-500 shrink-0" />
                        <span className="truncate">{job.companyName}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-violet-100 dark:border-haiti-800/80 text-[10px]">
                        <div className="flex items-center gap-1 text-slate-400 font-normal">
                          <Calendar size={10} />
                          <span>{job.appliedDate ? new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Saved'}</span>
                        </div>

                        {/* Status Selector */}
                        <select
                          value={job.status || 'Applied'}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            onStatusChange(jobId, e.target.value as JobStatus);
                          }}
                          className="rounded-md border border-violet-200 bg-chalk px-1.5 py-0.5 text-[10px] font-semibold text-haiti-900 dark:border-haiti-700 dark:bg-haiti-800 dark:text-white"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.key} value={c.key}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}