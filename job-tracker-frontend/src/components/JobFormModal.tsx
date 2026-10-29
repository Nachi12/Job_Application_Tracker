import { JobApplication } from '../types/models';
import { JOB_STATUS_OPTIONS } from '../utils/constants';
import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<JobApplication>) => Promise<void>;
  initial?: JobApplication | null;
}

export default function JobFormModal({
  open,
  onClose,
  onSubmit,
  initial
}: Props) {
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        company: initial.companyName,
        dateApplied: initial.appliedDate ? new Date(initial.appliedDate).toISOString().slice(0, 10) : ''
      });
    } else {
      setForm({
        company: '',
        role: '',
        jobLink: '',
        status: 'Applied',
        salary: '',
        location: '',
        recruiterName: '',
        recruiterEmail: '',
        jobDescription: '',
        dateApplied: new Date().toISOString().slice(0, 10),
        notes: ''
      });
    }
  }, [initial, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        companyName: form.company?.trim(),
        role: form.role?.trim(),
        jobLink: form.jobLink || '',
        status: form.status || 'Applied',
        location: form.location || '',
        salary: form.salary ? Number(form.salary) : 0,
        recruiterName: form.recruiterName || '',
        recruiterEmail: form.recruiterEmail || '',
        jobDescription: form.jobDescription || '',
        appliedDate: form.dateApplied
          ? new Date(form.dateApplied).toISOString()
          : new Date().toISOString(),
        notes: form.notes || ''
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error('SUBMIT ERROR:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {initial ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
              <input
                required
                name="company"
                placeholder="e.g. Google"
                value={form.company ?? ''}
                onChange={handleChange}
                className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Role / Title *</label>
              <input
                required
                name="role"
                placeholder="e.g. Senior Frontend Engineer"
                value={form.role ?? ''}
                onChange={handleChange}
                className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Job URL</label>
              <input
                name="jobLink"
                placeholder="https://..."
                value={form.jobLink ?? ''}
                onChange={handleChange}
                className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input
                name="location"
                placeholder="e.g. San Francisco, CA / Remote"
                value={form.location ?? ''}
                onChange={handleChange}
                className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Pipeline Stage</label>
              <select
                name="status"
                value={form.status ?? 'Applied'}
                onChange={handleChange}
                className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 font-medium"
              >
                {JOB_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary ($)</label>
              <input
                type="number"
                name="salary"
                placeholder="e.g. 140000"
                value={form.salary ?? ''}
                onChange={handleChange}
                className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Applied</label>
              <input
                type="date"
                name="dateApplied"
                value={form.dateApplied ?? ''}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
            <textarea
              rows={3}
              name="jobDescription"
              placeholder="Paste job description for AI analysis..."
              value={form.jobDescription ?? ''}
              onChange={handleChange}
              className="w-full rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white hover:bg-indigo-700 shadow-xs"
            >
              {saving ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}