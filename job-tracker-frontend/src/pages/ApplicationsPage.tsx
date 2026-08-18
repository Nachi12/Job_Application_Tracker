import { useState } from 'react';
import { useJobsContext } from '../context/JobsContext';
import JobTable from '../components/JobTable';
import JobFormModal from '../components/JobFormModal';
import { JobApplication, JobStatus } from '../types/models';
import { JOB_STATUS_OPTIONS, PAGE_SIZE } from '../utils/constants';
import { exportJobsToCsv } from '../utils/csvExport';
import { Plus, Search, Download, LayoutList, AlignJustify } from 'lucide-react';

export default function ApplicationsPage() {
  const { jobs, total, loading, filters, setFilters, create, update, remove } =
    useJobsContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (job: JobApplication) => {
    setEditing(job);
    setModalOpen(true);
  };

  const handleDelete = async (job: JobApplication) => {
    const id = job._id || job.id;
    if (confirm(`Delete application for ${job.companyName || (job as any).company}?`)) {
      await remove(id);
    }
  };

  const handleSubmit = async (data: Partial<JobApplication>) => {
    if (editing) {
      const id = editing._id || editing.id;
      await update(id, data);
    } else {
      await create(data);
    }
    setModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as JobStatus | 'ALL';
    setFilters({ status: v === 'ALL' ? undefined : v });
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center border-b border-violet-100 dark:border-haiti-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-haiti-900 dark:text-white tracking-tight">
            Job Applications Portfolio
          </h1>
          <p className="text-xs text-slate-500 dark:text-haiti-300 font-medium mt-0.5">
            Track, filter, and manage every job opportunity in one place.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {jobs.length > 0 && (
            <button
              onClick={() => exportJobsToCsv(jobs)}
              className="quantus-btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
            >
              <Download size={14} /> Export CSV
            </button>
          )}
          <button
            onClick={handleCreate}
            className="quantus-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
          >
            <Plus size={15} /> Add Application
          </button>
        </div>
      </div>

      {/* Filter & View Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 text-xs">
          <div className="relative min-w-[240px] flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-violet-500" />
            <input
              placeholder="Search by company, role, location, or tag..."
              className="w-full rounded-xl border border-violet-200 bg-white pl-9 pr-3 py-2 text-xs font-medium text-haiti-900 focus:border-violet-500 focus:outline-hidden dark:border-haiti-800 dark:bg-haiti-900 dark:text-white"
              value={filters.search ?? ''}
              onChange={handleSearchChange}
            />
          </div>

          <select
            value={filters.status ?? 'ALL'}
            onChange={handleStatusChange}
            className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-haiti-900 dark:border-haiti-800 dark:bg-haiti-900 dark:text-white"
          >
            <option value="ALL">All Pipeline Stages</option>
            {JOB_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Density Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-900">
          <button
            onClick={() => setDensity('comfortable')}
            title="Comfortable View"
            className={`p-1.5 rounded-lg transition ${
              density === 'comfortable' ? 'bg-white shadow-xs text-violet-500 dark:bg-haiti-800' : 'text-slate-400'
            }`}
          >
            <LayoutList size={15} />
          </button>
          <button
            onClick={() => setDensity('compact')}
            title="Compact View"
            className={`p-1.5 rounded-lg transition ${
              density === 'compact' ? 'bg-white shadow-xs text-violet-500 dark:bg-haiti-800' : 'text-slate-400'
            }`}
          >
            <AlignJustify size={15} />
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <JobTable
        jobs={jobs}
        total={total}
        loading={loading}
        page={filters.page ?? 1}
        density={density}
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