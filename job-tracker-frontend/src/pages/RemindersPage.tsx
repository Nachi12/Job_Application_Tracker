import { useState, useEffect } from 'react';
import { reminderService } from '../services/reminderService';
import { Reminder } from '../types/models';
import { useToastContext } from '../context/ToastContext';
import { Bell, Plus, CheckCircle, Calendar } from 'lucide-react';

export default function RemindersPage() {
  const { pushToast } = useToastContext();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type] = useState<'follow_up' | 'interview' | 'custom'>('follow_up');

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
    <div className="space-y-5 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-violet-100 dark:border-haiti-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-haiti-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Bell className="text-violet-500" size={20} /> Smart Reminders & Follow-ups
          </h1>
          <p className="text-xs text-slate-500 dark:text-haiti-300 font-normal mt-0.5">
            Stay on top of recruiter follow-ups, upcoming interviews, and application deadlines.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="quantus-btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} /> Add Reminder
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="quantus-card border-dashed p-8 text-center text-xs text-slate-400 dark:text-haiti-400">
              No active reminders. Add follow-up reminders to ensure no job opportunity gets cold!
            </div>
          ) : (
            reminders.map((r) => (
              <div
                key={r._id}
                className="quantus-card p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleStatusChange(r._id, r.status === 'completed' ? 'pending' : 'completed')}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      r.status === 'completed'
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-violet-200 dark:border-haiti-700 hover:border-violet-400'
                    }`}
                  >
                    {r.status === 'completed' && <CheckCircle size={12} />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-semibold ${r.status === 'completed' ? 'line-through text-slate-400 dark:text-haiti-400' : 'text-haiti-900 dark:text-white'}`}>
                      {r.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-haiti-300 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(r.dueDate).toLocaleDateString()}</span>
                      <span className="quantus-badge-violet font-semibold uppercase">{r.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {r.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(r._id, 'completed')}
                      className="quantus-btn-secondary text-[11px] h-7 px-2.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-haiti-950/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md quantus-card p-6 animate-fade-scale space-y-4">
            <h3 className="text-sm font-bold text-haiti-900 dark:text-white">Set Follow-up Reminder</h3>
            <div>
              <label className="block text-xs font-semibold text-haiti-900 dark:text-white mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Send follow-up email to recruiter"
                className="w-full rounded-lg border border-violet-100 bg-white p-2.5 text-xs text-haiti-900 focus:outline-hidden focus:ring-1 focus:ring-violet-500 focus:border-violet-500 dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-haiti-900 dark:text-white mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-violet-100 bg-white p-2.5 text-xs text-haiti-900 focus:outline-hidden focus:ring-1 focus:ring-violet-500 focus:border-violet-500 dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="quantus-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="quantus-btn-primary text-xs"
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
