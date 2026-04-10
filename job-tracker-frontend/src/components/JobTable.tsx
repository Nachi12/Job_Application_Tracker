import { JobApplication } from '../types/models';
import { formatDate } from '../utils/dateUtils';
import { JOB_STATUS_LABELS, PAGE_SIZE } from '../utils/constants';
import Pagination from './Pagination';
import { SkeletonRow } from './Skeleton';

interface Props {
  jobs: JobApplication[];
  total: number;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
}

export default function JobTable({
  jobs,
  total,
  loading,
  page,
  onPageChange,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Date applied</th>
              <th className="px-3 py-2">Salary</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => <SkeletonRow key={idx} />)
              : jobs.length === 0
              ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-xs text-slate-500 dark:text-slate-400"
                >
                  You have no applications yet. Use “Add application” to get started.
                </td>
              </tr>
                )
              : jobs.map((job) => (
              <tr
                key={job.id}
                className="border-t border-slate-100 text-[13px] hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                <td className="px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{job.company}</span>
                    {job.jobLink && (
                      <a
                        href={job.jobLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-primary hover:underline"
                      >
                        View job
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">{job.role}</td>
                <td className="px-3 py-2">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {JOB_STATUS_LABELS[job.status]}
                  </span>
                </td>
                <td className="px-3 py-2">{formatDate(job.dateApplied)}</td>
                <td className="px-3 py-2">
                  {job.salary ? `₹${job.salary.toLocaleString()}` : '-'}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => onEdit(job)}
                    className="mr-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(job)}
                    className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        onChange={onPageChange}
      />
    </div>
  );
}