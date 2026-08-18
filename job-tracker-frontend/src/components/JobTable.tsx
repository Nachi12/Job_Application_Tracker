import { useNavigate } from 'react-router-dom';

import { JobApplication } from '../types/models';
import { formatDate } from '../utils/dateUtils';
import { JOB_STATUS_LABELS, PAGE_SIZE } from '../utils/constants';
import Pagination from './Pagination';
import { SkeletonRow } from './Skeleton';
import { ExternalLink, Eye, Edit2, Trash2 } from 'lucide-react';

interface Props {
  jobs: JobApplication[];
  total: number;
  loading: boolean;
  page: number;
  density?: 'comfortable' | 'compact';
  onPageChange: (page: number) => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
}

export default function JobTable({
  jobs,
  total,
  loading,
  page,
  density = 'comfortable',
  onPageChange,
  onEdit,
  onDelete
}: Props) {
  const navigate = useNavigate();
  const pyClass = density === 'compact' ? 'py-2' : 'py-3.5';

  return (
    <div className="quantus-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-violet-100 bg-chalk text-[10px] font-extrabold uppercase tracking-wider text-haiti-900 dark:border-haiti-800 dark:bg-haiti-950 dark:text-haiti-300">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Pipeline Stage</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Applied Date</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-100 dark:divide-haiti-800/60">
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => <SkeletonRow key={idx} />)
              : jobs.length === 0
              ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-xs text-slate-400 dark:text-haiti-300"
                >
                  No applications found. Click "Add Application" to start tracking!
                </td>
              </tr>
                )
              : jobs.map((job) => {
                  const jobId = job._id || job.id;
                  const company = job.companyName || (job as any).company;

                  return (
                    <tr
                      key={jobId}
                      className="group text-xs transition hover:bg-violet-50/50 dark:hover:bg-haiti-900/60"
                    >
                      <td className={`px-4 ${pyClass} font-extrabold text-haiti-900 dark:text-white`}>
                        <div className="flex items-center gap-2">
                          <span>{company}</span>
                          {job.jobLink && (
                            <a
                              href={job.jobLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-violet-500 transition"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 ${pyClass} text-slate-700 dark:text-haiti-100 font-medium`}>
                        <button
                          onClick={() => navigate(`/applications/${jobId}`)}
                          className="hover:text-violet-500 font-extrabold text-left transition"
                        >
                          {job.role}
                        </button>
                      </td>
                      <td className={`px-4 ${pyClass}`}>
                        <span className="inline-flex rounded-lg bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-600 dark:bg-haiti-800 dark:text-violet-300 border border-violet-200 dark:border-haiti-700">
                          {JOB_STATUS_LABELS[job.status] || job.status}
                        </span>
                      </td>
                      <td className={`px-4 ${pyClass} text-slate-500 dark:text-haiti-300 font-medium`}>
                        {job.source || 'LinkedIn'}
                      </td>
                      <td className={`px-4 ${pyClass} text-slate-500 dark:text-haiti-300`}>
                        {job.appliedDate ? formatDate(job.appliedDate) : 'Saved'}
                      </td>
                      <td className={`px-4 ${pyClass} text-haiti-900 dark:text-white font-semibold`}>
                        {job.salary ? `$${job.salary.toLocaleString()}` : '-'}
                      </td>
                      <td className={`px-4 ${pyClass} text-right`}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/applications/${jobId}`)}
                            title="View Detail Workspace"
                            className="p-1.5 rounded-lg bg-chalk text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:bg-haiti-900 dark:text-haiti-200 transition"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => onEdit(job)}
                            title="Edit"
                            className="p-1.5 rounded-lg bg-chalk text-slate-500 hover:text-haiti-900 hover:bg-violet-50 dark:bg-haiti-900 dark:text-haiti-200 transition"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(job)}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-chalk text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:bg-haiti-900 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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