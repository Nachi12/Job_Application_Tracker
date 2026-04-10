import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { useToast } from '../hooks/useToast';
import { SubscriptionPlan } from '../types/models';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { pushToast } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [plan, setPlan] = useState<SubscriptionPlan>(user?.plan ?? 'FREE');
  const [changingPassword, setChangingPassword] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return null;

 const handleProfileSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    const updated = await userService.updateProfile({ name });

    // 🔥 UPDATE UI INSTANTLY
    updateUser(updated);

    pushToast('success', 'Profile updated');
  } catch {
    pushToast('error', 'Update failed');
  } finally {
    setSaving(false);
  }
};

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await userService.changePassword(
        changingPassword.currentPassword,
        changingPassword.newPassword
      );
      pushToast('success', 'Password changed');
      setChangingPassword({ currentPassword: '', newPassword: '' });
    } catch {
      pushToast('error', 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePlanChange = async (p: SubscriptionPlan) => {
    setPlan(p);
    await userService.changePlan(p);
    await refreshUser();
    pushToast('success', `Switched to ${p} plan`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1.5fr]">
      <form
        onSubmit={handleProfileSave}
        className="space-y-3 rounded-xl border border-slate-200 bg-white/90 p-4 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
      >
        <div className="mb-1 text-sm font-semibold">Profile</div>
        <div className="space-y-1">
          <label className="block text-[11px] font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-medium">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <div className="space-y-4">
        <form
          onSubmit={handlePasswordSave}
          className="space-y-3 rounded-xl border border-slate-200 bg-white/90 p-4 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="mb-1 text-sm font-semibold">Change password</div>
          <div className="space-y-1">
            <label className="block text-[11px] font-medium">
              Current password
            </label>
            <input
              type="password"
              value={changingPassword.currentPassword}
              onChange={(e) =>
                setChangingPassword((p) => ({
                  ...p,
                  currentPassword: e.target.value
                }))
              }
              className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-medium">
              New password
            </label>
            <input
              type="password"
              value={changingPassword.newPassword}
              onChange={(e) =>
                setChangingPassword((p) => ({
                  ...p,
                  newPassword: e.target.value
                }))
              }
              className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="mt-2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {savingPassword ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white/90 p-4 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-1 text-sm font-semibold">Subscription</div>
          <div className="mb-3 text-[11px] text-slate-500 dark:text-slate-400">
            Choose between Free and Pro. Pro unlocks advanced analytics and
            priority reminders.
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <button
              type="button"
              onClick={() => handlePlanChange('FREE')}
              className={`rounded-lg border px-3 py-2 text-left text-xs ${
                user.plan === 'FREE'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="font-semibold">Free</div>
              <div className="text-[11px] text-slate-500">
                Basic tracking, up to 50 applications.
              </div>
            </button>
            <button
              type="button"
              onClick={() => handlePlanChange('PRO')}
              className={`rounded-lg border px-3 py-2 text-left text-xs ${
                user.plan === 'PRO'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="font-semibold">Pro</div>
              <div className="text-[11px] text-slate-500">
                Unlimited applications, advanced analytics, smart reminders.
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}