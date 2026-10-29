import { useNavigate } from 'react-router-dom';
import { JobApplication } from '../types/models';
import { formatDate } from '../utils/dateUtils';
import { JOB_STATUS_LABELS, PAGE_SIZE } from '../utils/constants';
import Pagination from './Pagination';
import { SkeletonRow } from './Skeleton';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';

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
  const navigate = useNavigate();

  return (
    <div className="quantus-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-[#D4AF83]/30 bg-[#F3ECDE]/60 text-[10px] font-semibold uppercase tracking-wider text-[#183451]/80 dark:border-white/10 dark:bg-[#0B1623] dark:text-[#D4AF83]">
            <tr>
              <th className="px-4 py-2.5">Company</th>
              <th className="px-4 py-2.5">Role</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Applied</th>
              <th className="px-4 py-2.5">Salary</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF83]/20 dark:divide-white/5">
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => <SkeletonRow key={idx} />)
              : jobs.length === 0
              ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-xs text-stone-400 dark:text-stone-400"
                >
                  No applications found. Click "Add Application" to start tracking.
                </td>
              </tr>
                )
              : jobs.map((job) => {
                  const jobId = job._id || job.id;
                  const company = job.companyName || (job as any).company;

                  return (
                    <tr
                      key={jobId}
                      className="group text-xs transition hover:bg-[#FAF7F2] dark:hover:bg-[#11253A]/70"
                    >
                      <td className="px-4 py-2.5 font-semibold text-[#183451] dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{company}</span>
                          {job.jobLink && (
                            <a
                              href={job.jobLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-stone-400 hover:text-[#A9501C] transition"
                            >
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[#183451]/90 dark:text-[#FAF7F2]/90 font-medium">
                        <button
                          onClick={() => navigate(`/applications/${jobId}`)}
                          className="hover:text-[#A9501C] font-semibold text-left transition"
                        >
                          {job.role}
                        </button>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex rounded-md bg-[#F3ECDE] border border-[#D4AF83]/50 px-2 py-0.5 text-[11px] font-semibold text-[#183451] dark:bg-[#11253A] dark:text-[#D4AF83]">
                          {JOB_STATUS_LABELS[job.status] || job.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-stone-500 dark:text-stone-400 font-normal">
                        {job.source || 'LinkedIn'}
                      </td>
                      <td className="px-4 py-2.5 text-stone-500 dark:text-stone-400 font-normal">
                        {job.appliedDate ? formatDate(job.appliedDate) : 'Saved'}
                      </td>
                      <td className="px-4 py-2.5 text-[#183451] dark:text-white font-medium">
                        {job.salary ? `$${job.salary.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEdit(job)}
                            title="Edit"
                            className="p-1 rounded-md text-stone-400 hover:text-[#183451] hover:bg-[#F3ECDE] dark:hover:bg-[#11253A] dark:hover:text-white transition"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDelete(job)}
                            title="Delete"
                            className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 size={13} />
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