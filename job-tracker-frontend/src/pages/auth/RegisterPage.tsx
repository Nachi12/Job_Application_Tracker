import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import DarkModeToggle from '../../components/DarkModeToggle';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const INITIAL_STATE: RegisterFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: true,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast } = useToast();
  const { register, isAuthenticated } = useAuth();

  const [form, setForm] = useState<RegisterFormState>(INITIAL_STATE);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already authenticated
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

  // Password rule checks matching backend validation
  const rules = {
    minLength: form.password.length >= 8,
    hasUpper: /[A-Z]/.test(form.password),
    hasLower: /[a-z]/.test(form.password),
    hasNumber: /\d/.test(form.password),
    matchesConfirm: form.password.length > 0 && form.password === form.confirmPassword,
  };

  const isPasswordValid = rules.minLength && rules.hasUpper && rules.hasLower && rules.hasNumber;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const cleanEmail = form.email.trim();

    if (!trimmedName || !cleanEmail || !form.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all requirements below.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter to confirm.');
      return;
    }

    if (!form.agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await register(trimmedName, cleanEmail, form.password);
      pushToast('success', 'Account created successfully! Welcome to HireLog.');
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      let msg = 'Failed to create account. Please try again.';
      if (!err?.response) {
        msg = 'Unable to connect to the server. Please check your backend service.';
      } else if (err?.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      }
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
        <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-turbo-500/10 blur-3xl dark:bg-violet-900/20" />
      </div>

      {/* Top Bar with Theme Toggle */}
      <header className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <DarkModeToggle />
      </header>

      <main className="w-full max-w-[440px]">
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
              Get Started
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-violet-200/70">
            Start organizing your job search pipeline smarter.
          </p>
        </div>

        {/* Card */}
        <section className="relative rounded-3xl border border-violet-100/90 bg-white/95 p-7 sm:p-8 shadow-2xl shadow-violet-900/5 backdrop-blur-xl transition-all dark:border-violet-900/30 dark:bg-[#150D27]/95 dark:shadow-2xl dark:shadow-black/60">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-violet-200/60">
              Free forever for individual job seekers. No credit card required.
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 dark:text-violet-200"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-violet-300/60">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-900/40 dark:bg-[#0B0617]/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-[#0B0617]"
                  required
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-violet-200"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-violet-300/60">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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

              {/* Password Requirements Checklist */}
              {form.password.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-[11px] dark:border-violet-900/30 dark:bg-[#0B0617]/50">
                  <div className={`flex items-center gap-1.5 ${rules.minLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.hasUpper ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>1 uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasLower ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.hasLower ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>1 lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>1 number</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-700 dark:text-violet-200"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-violet-300/60">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-900/40 dark:bg-[#0B0617]/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-[#0B0617]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-violet-300/60 dark:hover:text-violet-200 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {form.confirmPassword.length > 0 && (
                <p className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${rules.matchesConfirm ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                  {rules.matchesConfirm ? (
                    <>
                      <Check className="h-3 w-3" /> Passwords match
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3" /> Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-violet-800 dark:bg-[#0B0617]"
                />
                <span className="text-xs text-slate-600 dark:text-violet-200/80">
                  I agree to the Terms of Service & Privacy Policy
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-150 hover:bg-violet-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Redirect */}
          <p className="mt-5 text-center text-xs text-slate-500 dark:text-violet-200/70">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-violet-600 hover:text-violet-700 hover:underline dark:text-violet-400 dark:hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>
        </section>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 dark:text-violet-300/40">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Protected with secure JWT authentication</span>
        </div>
      </main>
    </div>
  );
}
