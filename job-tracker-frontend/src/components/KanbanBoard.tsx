import { JobApplication, JobStatus } from '../types/models';
import { JOB_STATUS_LABELS } from '../utils/constants';

interface Props {
  jobs: JobApplication[];
  onStatusChange: (id: string, status: JobStatus) => void;
}

// 🔥 FIX: map frontend → backend
const statusMap: Record<JobStatus, string> = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

const columns: JobStatus[] = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

export default function KanbanBoard({ jobs = [], onStatusChange }: Props) {

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    jobId: string
  ) => {
    e.dataTransfer.setData('text/plain', jobId);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    status: JobStatus
  ) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onStatusChange(id, status);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {columns.map((status) => {
        const backendStatus = statusMap[status];

        const filteredJobs = jobs.filter(
          (j) => j.status === backendStatus
        );

        return (
          <div
            key={status}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
            className="flex min-h-[260px] flex-col rounded-xl border p-3"
          >
            <div className="mb-2 flex justify-between">
              <div className="font-semibold">
                {JOB_STATUS_LABELS[status]}
              </div>
              <div>{filteredJobs.length}</div>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {filteredJobs.map((job) => (
                <div
                  key={job.id || job._id || `${job.company}-${job.role}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, job.id)}
                  className="cursor-move rounded border p-2"
                >
                  <div className="font-semibold">{job.role}</div>

                  {/* 🔥 FIX */}
                  <div>{job.companyName}</div>

                  {/* 🔥 SAFE DATE */}
                  {job.interviewDate && (
                    <div>
                      Interview:{' '}
                      {new Date(job.interviewDate)
                        .toISOString()
                        .slice(0, 10)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}