import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import DarkModeToggle from '../../components/DarkModeToggle';
import { Lock, Eye, EyeOff, ArrowRight, Briefcase, ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const rules = {
    minLength: form.password.length >= 8,
    hasUpper: /[A-Z]/.test(form.password),
    hasLower: /[a-z]/.test(form.password),
    hasNumber: /\d/.test(form.password),
    matchesConfirm: form.password.length > 0 && form.password === form.confirmPassword,
  };

  const isPasswordValid = rules.minLength && rules.hasUpper && rules.hasLower && rules.hasNumber;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage('Reset token is missing or invalid.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await authService.resetPassword(token, form.password);
      pushToast('success', 'Password reset successfully! You can now sign in.');
      navigate('/login');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || 'Failed to reset password. The link may have expired.';
      setErrorMessage(msg);
      pushToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8F7FF] dark:bg-[#0B0617] px-4 py-10 transition-colors duration-200">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[32rem] w-[46rem] rounded-full bg-gradient-to-tr from-violet-600/20 via-purple-500/15 to-transparent blur-3xl dark:from-violet-600/15 dark:via-purple-900/15" />
      </div>

      {/* Top Bar with Theme Toggle */}
      <header className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <DarkModeToggle />
      </header>

      <main className="w-full max-w-[420px]">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-700 via-violet-600 to-violet-500 text-white shadow-xl shadow-violet-500/25 ring-4 ring-violet-500/10 dark:ring-violet-400/10">
            <Briefcase className="h-7 w-7" />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              HireLog
            </h1>
            <span className="rounded-full bg-violet-100 dark:bg-violet-900/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40">
              Security
            </span>
          </div>
        </div>

        {/* Card */}
        <section className="relative rounded-3xl border border-violet-100/90 bg-white/95 p-7 sm:p-8 shadow-2xl shadow-violet-900/5 backdrop-blur-xl transition-all dark:border-violet-900/30 dark:bg-[#150D27]/95 dark:shadow-2xl dark:shadow-black/60">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Set new password
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-violet-200/60">
              Please enter your new password below.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-violet-200"
              >
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-violet-300/60">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-900/40 dark:bg-[#0B0617]/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-[#0B0617]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-violet-300/60 dark:hover:text-violet-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-[11px] dark:border-violet-900/30 dark:bg-[#0B0617]/50">
                  <div className={`flex items-center gap-1.5 ${rules.minLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                    {rules.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                    {rules.hasUpper ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>1 uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasLower ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                    {rules.hasLower ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>1 lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400'}`}>
                    {rules.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>1 number</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-700 dark:text-violet-200"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-violet-300/60">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-900/40 dark:bg-[#0B0617]/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-[#0B0617]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-violet-300/60 dark:hover:text-violet-200"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-150 hover:bg-violet-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-violet-600 dark:text-violet-300/70 dark:hover:text-violet-200 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
