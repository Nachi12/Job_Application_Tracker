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

  // 🔥 Initialize form
  useEffect(() => {
    if (initial) {
      setForm(initial);
    } else {
      setForm({
        company: '',
        role: '',
        jobLink: '',
        status: 'APPLIED',
        salary: '',
        dateApplied: new Date().toISOString().slice(0, 10),
        interviewDate: '',
        deadlineDate: '',
        notes: ''
      });
    }
  }, [initial]);

  // 🔥 Handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔥 FINAL FIXED SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        companyName: form.company?.trim(), // ✅ FIX
        role: form.role?.trim(),
        jobLink: form.jobLink || '',
        status: form.status || 'APPLIED',
        salary: form.salary ? Number(form.salary) : 0,

        appliedDate: form.dateApplied
          ? new Date(form.dateApplied).toISOString()
          : new Date().toISOString(), // ✅ FIX

        interviewDate: form.interviewDate
          ? new Date(form.interviewDate).toISOString()
          : undefined,

        deadlineDate: form.deadlineDate
          ? new Date(form.deadlineDate).toISOString()
          : undefined,

        notes: form.notes || ''
      };

      console.log("FINAL PAYLOAD:", payload);

      await onSubmit(payload);

      onClose();
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">

        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {initial ? 'Edit application' : 'Add new application'}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">

          <div className="grid gap-3 md:grid-cols-2">
            <input
              required
              name="company"
              placeholder="Company"
              value={form.company ?? ''}
              onChange={handleChange}
              className="border px-2 py-1.5"
            />

            <input
              required
              name="role"
              placeholder="Role"
              value={form.role ?? ''}
              onChange={handleChange}
              className="border px-2 py-1.5"
            />
          </div>

          <input
            name="jobLink"
            placeholder="Job Link"
            value={form.jobLink ?? ''}
            onChange={handleChange}
            className="w-full border px-2 py-1.5"
          />

          <div className="grid gap-3 md:grid-cols-3">
            <select
              name="status"
              value={form.status ?? 'APPLIED'}
              onChange={handleChange}
              className="border px-2 py-1.5"
            >
              {JOB_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={form.salary ?? ''}
              onChange={handleChange}
              className="border px-2 py-1.5"
            />

            <input
              type="date"
              name="dateApplied"
              value={form.dateApplied ?? ''}
              onChange={handleChange}
              required
              className="border px-2 py-1.5"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="date"
              name="interviewDate"
              value={form.interviewDate ?? ''}
              onChange={handleChange}
              className="border px-2 py-1.5"
            />

            <input
              type="date"
              name="deadlineDate"
              value={form.deadlineDate ?? ''}
              onChange={handleChange}
              className="border px-2 py-1.5"
            />
          </div>

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes ?? ''}
            onChange={handleChange}
            className="w-full border px-2 py-1.5"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}