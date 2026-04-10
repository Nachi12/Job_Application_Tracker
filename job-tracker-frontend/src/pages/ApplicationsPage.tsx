import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import JobTable from '../components/JobTable';
import JobFormModal from '../components/JobFormModal';
import { JobApplication, JobStatus } from '../types/models';
import { JOB_STATUS_OPTIONS, PAGE_SIZE } from '../utils/constants';
import { useToast } from '../hooks/useToast';

export default function ApplicationsPage() {
  const { jobs, total, loading, filters, setFilters, create, update, remove } =
    useJobs();
  const { pushToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (job: JobApplication) => {
    setEditing(job);
    setModalOpen(true);
  };

  const handleDelete = async (job: JobApplication) => {
    if (confirm(`Delete application for ${job.company}?`)) {
      await remove(job.id);
    }
  };
const handleSubmit = async (data: Partial<JobApplication>) => {
  try {
    if (editing) {
      await update(editing.id, data);
      pushToast('success', 'Application updated');
    } else {
      await create(data);
      pushToast('success', 'Application added');
    }

    setModalOpen(false); // 🔥 CLOSE MODAL

  } catch (err) {
    pushToast('error', 'Something went wrong');
  }
};

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as JobStatus | 'ALL';
    setFilters({ status: v === 'ALL' ? undefined : v });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortDir] = e.target.value.split(':') as [
      'dateApplied' | 'status',
      'asc' | 'desc'
    ];
    setFilters({ sortBy, sortDir });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">Applications</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add, search, and manage all your job applications.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark"
        >
          Add application
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <input
          placeholder="Search by company or role…"
          className="w-full min-w-[200px] flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          value={filters.search ?? ''}
          onChange={handleSearchChange}
        />
        <select
          value={filters.status ?? 'ALL'}
          onChange={handleStatusChange}
          className="rounded-md border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="ALL">All statuses</option>
          {JOB_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={`${filters.sortBy}:${filters.sortDir}`}
          onChange={handleSortChange}
          className="rounded-md border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="dateApplied:desc">Newest first</option>
          <option value="dateApplied:asc">Oldest first</option>
          <option value="status:asc">Status A-Z</option>
          <option value="status:desc">Status Z-A</option>
        </select>
      </div>

      <JobTable
        jobs={jobs}
        total={total}
        loading={loading}
        page={filters.page ?? 1}
        onPageChange={(page) => setFilters({ page, pageSize: PAGE_SIZE })}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <JobFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}