import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      pushToast('error', 'Reset token is missing');
      return;
    }
    if (form.password !== form.confirmPassword) {
      pushToast('error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      pushToast('success', 'Password reset successfully. You can now sign in.');
      navigate('/login');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || 'Failed to reset password, try again';
      pushToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              JT
            </div>
            <div>
              <div className="text-sm font-semibold">Reset password</div>
              <div className="text-xs text-slate-500">
                Choose a new password for your account.
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium">
              New password
            </label>
            <input
              type="password"
              required
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-medium">
              Confirm password
            </label>
            <input
              type="password"
              required
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-70"
          >
            {loading ? 'Resetting password…' : 'Reset password'}
          </button>
        </form>

        <div className="mt-4 text-center text-[11px] text-slate-500">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
