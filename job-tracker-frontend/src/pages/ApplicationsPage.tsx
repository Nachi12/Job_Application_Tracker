import { useState } from 'react';
import { useJobsContext } from '../context/JobsContext';
import JobTable from '../components/JobTable';
import JobFormModal from '../components/JobFormModal';
import { JobApplication, JobStatus } from '../types/models';
import { JOB_STATUS_OPTIONS, PAGE_SIZE } from '../utils/constants';
import { exportJobsToCsv } from '../utils/csvExport';
import { Plus, Search, Download } from 'lucide-react';

export default function ApplicationsPage() {
  const { jobs, total, loading, filters, setFilters, create, update, remove } =
    useJobsContext();
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
    const id = job._id || job.id;
    if (id && confirm(`Delete application for ${job.companyName || (job as any).company}?`)) {
      await remove(id);
    }
  };

  const handleSubmit = async (data: Partial<JobApplication>) => {
    if (editing) {
      const id = editing._id || editing.id;
      if (id) await update(id, data);
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
    <div className="space-y-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center border-b border-[#D4AF83]/30 dark:border-white/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#183451] dark:text-[#FAF7F2] tracking-tight">
            Applications
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-normal mt-0.5">
            Track and deliberate every opportunity across your career pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {jobs.length > 0 && (
            <button
              onClick={() => exportJobsToCsv(jobs)}
              className="quantus-btn-secondary text-xs flex items-center gap-1.5"
            >
              <Download size={14} /> Export CSV
            </button>
          )}
          <button
            onClick={handleCreate}
            className="quantus-btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Application
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="relative min-w-[240px] flex-1">
          <Search size={14} className="absolute left-3 top-2.5 text-[#A9501C]" />
          <input
            placeholder="Filter by company, role, location..."
            className="w-full rounded-xl border border-[#D4AF83]/50 bg-white pl-8 pr-3 py-1.5 text-xs font-normal text-[#183451] focus:border-[#A9501C] focus:outline-hidden dark:border-white/15 dark:bg-[#11253A] dark:text-white"
            value={filters.search ?? ''}
            onChange={handleSearchChange}
          />
        </div>

        <select
          value={filters.status ?? 'ALL'}
          onChange={handleStatusChange}
          className="rounded-xl border border-[#D4AF83]/50 bg-white px-3 py-1.5 text-xs font-medium text-[#183451] dark:border-white/15 dark:bg-[#11253A] dark:text-white"
        >
          <option value="ALL">All Statuses</option>
          {JOB_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Table */}
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