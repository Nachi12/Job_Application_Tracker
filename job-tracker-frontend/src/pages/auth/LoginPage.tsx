import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import DarkModeToggle from '../../components/DarkModeToggle';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

const INITIAL_STATE: LoginFormState = {
  email: '',
  password: '',
  rememberMe: true,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast } = useToast();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState<LoginFormState>(INITIAL_STATE);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [demoLoading, setDemoLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setErrorMessage(null);
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const executeLogin = async (emailToSubmit: string, passwordToSubmit: string) => {
    const cleanEmail = emailToSubmit.trim();
    if (!cleanEmail || !passwordToSubmit) {
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      await login(cleanEmail, passwordToSubmit);
      pushToast('success', 'Welcome back to HireLog!');
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      let msg = 'Invalid email or password. Please verify your credentials.';
      if (!error?.response) {
        msg = 'Unable to reach the server. Please check your internet connection or backend service.';
      } else if (error?.response?.data?.error) {
        msg = error.response.data.error;
      } else if (error?.response?.data?.message) {
        msg = error.response.data.message;
      }
      setErrorMessage(msg);
      pushToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await executeLogin(form.email, form.password);
  };

  const handleInstantDemoLogin = async () => {
    setErrorMessage(null);
    setDemoLoading(true);
    setForm({
      email: 'demo@hirelog.app',
      password: 'Password123!',
      rememberMe: true,
    });

    try {
      await login('demo@hirelog.app', 'Password123!');
      pushToast('success', 'Logged in as Demo Candidate');
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Demo login error:', error);
      let msg = 'Failed to connect to demo account.';
      if (error?.response?.data?.error) {
        msg = error.response.data.error;
      }
      setErrorMessage(msg);
      pushToast('error', msg);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8F7FF] dark:bg-[#0B0617] px-4 py-10 transition-colors duration-200">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[32rem] w-[46rem] rounded-full bg-gradient-to-tr from-violet-600/20 via-purple-500/15 to-transparent blur-3xl dark:from-violet-600/15 dark:via-purple-900/15" />
        <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-turbo-500/10 blur-3xl dark:bg-violet-900/20" />
        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-800/10" />
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
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-turbo-500 text-[9px] font-black text-haiti-900 shadow">
              ✓
            </span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              HireLog
            </h1>
            <span className="rounded-full bg-violet-100 dark:bg-violet-900/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40">
              Job Search OS
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-violet-200/70">
            Manage applications, track interviews & optimize your job search.
          </p>
        </div>

        {/* Card */}
        <section className="relative rounded-3xl border border-violet-100/90 bg-white/95 p-7 sm:p-8 shadow-2xl shadow-violet-900/5 backdrop-blur-xl transition-all dark:border-violet-900/30 dark:bg-[#150D27]/95 dark:shadow-2xl dark:shadow-black/60">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-violet-200/60">
              Sign in with your email to continue to your dashboard.
            </p>
          </div>

          {/* Inline Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 animate-in fade-in duration-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-violet-200"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-violet-300/60">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="alex@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-900/40 dark:bg-[#0B0617]/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-[#0B0617]"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 dark:text-violet-200"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-violet-300/60">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-900/40 dark:bg-[#0B0617]/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-[#0B0617]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-violet-300/60 dark:hover:text-violet-200 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-violet-800 dark:bg-[#0B0617]"
                />
                <span className="text-xs text-slate-600 dark:text-violet-200/80 font-medium">
                  Remember me on this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || demoLoading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-150 hover:bg-violet-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200/80 dark:bg-violet-900/40" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-violet-300/40">
              or quick explore
            </span>
            <div className="h-px flex-1 bg-slate-200/80 dark:bg-violet-900/40" />
          </div>

          {/* Quick 1-Click Demo Login Button */}
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            disabled={loading || demoLoading}
            className="group flex w-full items-center justify-between rounded-xl border border-violet-200/80 bg-violet-50/70 p-3 text-left transition-all hover:border-violet-400 hover:bg-violet-100/70 dark:border-violet-900/60 dark:bg-violet-950/30 dark:hover:border-violet-700 dark:hover:bg-violet-950/60"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-turbo-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-violet-950 dark:text-violet-100 flex items-center gap-1.5">
                  <span>Explore Demo Account</span>
                  <span className="rounded bg-violet-200 dark:bg-violet-900/80 px-1.5 py-0.2 text-[9px] font-bold text-violet-800 dark:text-turbo-400 uppercase">
                    1-Click
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-violet-300/60">
                  Preloaded with applications, metrics & prep notes
                </div>
              </div>
            </div>
            {demoLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
            ) : (
              <ArrowRight className="h-4 w-4 text-violet-500 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>

          {/* Sign Up Redirect */}
          <p className="mt-5 text-center text-xs text-slate-500 dark:text-violet-200/70">
            Don’t have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-violet-600 hover:text-violet-700 hover:underline dark:text-violet-400 dark:hover:text-violet-300"
            >
              Create free account
            </Link>
          </p>
        </section>

        {/* Security & Features footer */}
        <div className="mt-5 flex items-center justify-center gap-4 text-center text-[11px] text-slate-400 dark:text-violet-300/50">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
            <span>Encrypted JWT Sessions</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>AI Job Tracker</span>
          </div>
        </div>
      </main>
    </div>
  );
}
