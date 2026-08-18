import { useState, useEffect } from 'react';
import { reminderService } from '../services/reminderService';
import { Reminder } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import { Bell, Plus, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function RemindersPage() {
  const { pushToast } = useToastContext();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'follow_up' | 'interview' | 'custom'>('follow_up');

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await reminderService.list();
      setReminders(data);
    } catch (e) {
      pushToast('error', 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      pushToast('error', 'Title and due date are required.');
      return;
    }
    try {
      await reminderService.create({ title, dueDate, type });
      pushToast('success', 'Reminder set successfully');
      setShowModal(false);
      setTitle('');
      setDueDate('');
      loadReminders();
    } catch (e) {
      pushToast('error', 'Failed to create reminder');
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'completed' | 'snoozed') => {
    try {
      await reminderService.updateStatus(id, status);
      pushToast('success', `Reminder marked as ${status}`);
      loadReminders();
    } catch (e) {
      pushToast('error', 'Failed to update reminder status');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
            <Bell className="text-indigo-600 dark:text-indigo-400" size={22} /> Smart Reminders & Follow-ups
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stay on top of recruiter follow-ups, upcoming interviews, and application deadlines.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
        >
          <Plus size={14} /> Add Reminder
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
              No active reminders. Add follow-up reminders to ensure no job opportunity gets cold!
            </div>
          ) : (
            reminders.map((r) => (
              <div
                key={r._id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusChange(r._id, r.status === 'completed' ? 'pending' : 'completed')}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      r.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {r.status === 'completed' && <CheckCircle size={12} />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-semibold ${r.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {r.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(r.dueDate).toLocaleDateString()}</span>
                      <span className="uppercase font-bold text-indigo-600">{r.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {r.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(r._id, 'completed')}
                      className="rounded border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Set Follow-up Reminder</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Send follow-up email to recruiter"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Save Reminder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
