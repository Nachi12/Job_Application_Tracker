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
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Building2,
  Calendar,
  Compass,
  Check
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
      pushToast('success', 'Welcome back to HireLog');
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      let msg = 'Invalid email or password. Please verify your credentials.';
      if (!error?.response) {
        msg = 'Unable to reach the server. Please check your network or backend service.';
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
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#11253A] dark:bg-[#0B1623] dark:text-[#FAF7F2] transition-colors duration-200 flex flex-col justify-between selection:bg-[#D4AF83]/30 selection:text-[#183451]">
      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-[#183451] dark:bg-[#FAF7F2] flex items-center justify-center text-[#FAF7F2] dark:text-[#183451] shadow-sm transition-transform group-hover:scale-105">
            <span className="font-serif font-bold text-base tracking-tighter">H</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#A9501C] -ml-0.5 mt-2" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg tracking-tight text-[#183451] dark:text-[#FAF7F2] leading-none">
              HireLog
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-[#A9501C] mt-0.5">
              Career OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs text-[#183451]/60 dark:text-[#FAF7F2]/60">
            Need an account?
          </span>
          <Link
            to="/register"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D4AF83]/60 hover:border-[#A9501C] bg-white/60 dark:bg-[#11253A]/80 text-[#183451] dark:text-[#FAF7F2] transition-all hover:bg-white"
          >
            Create account
          </Link>
          <DarkModeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-[#D4AF83]/35 dark:border-white/10 bg-white/90 dark:bg-[#0F1E2E]/95 shadow-xl shadow-[#183451]/5 dark:shadow-black/40 overflow-hidden backdrop-blur-sm">
          
          {/* Left Column: Editorial Showcase (Riviera Blue Signature) */}
          <section className="lg:col-span-5 bg-[#183451] p-8 sm:p-10 text-[#FAF7F2] relative flex flex-col justify-between overflow-hidden">
            {/* Subtle architectural grid pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#F3ECDE_1px,transparent_1px),linear-gradient(to_bottom,#F3ECDE_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#A9501C]/20 blur-3xl" />
            <div className="pointer-events-none absolute top-0 -left-10 h-48 w-48 rounded-full bg-[#D4AF83]/15 blur-2xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#D4AF83]/30 bg-white/5 text-[#D4AF83] text-[11px] font-medium tracking-wide mb-6">
                <Compass className="h-3.5 w-3.5 text-[#A9501C]" />
                <span>The Editorial Pipeline for High-Intent Roles</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#FAF7F2] leading-snug">
                Manage your search with the rigor of an executive search firm.
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-[#F3ECDE]/75 leading-relaxed font-light">
                Track interview stages, evaluate salary comps, generate tailored cover notes, and monitor response velocity in one focused environment.
              </p>
            </div>

            {/* Live Pipeline Snippet Card */}
            <div className="relative z-10 my-8 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-[#FAF7F2] text-[#183451] flex items-center justify-center font-bold text-xs">
                      S
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Stripe</div>
                      <div className="text-[10px] text-[#D4AF83]">Staff Solutions Architect</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#A9501C]/30 border border-[#A9501C]/60 px-2 py-0.5 text-[10px] font-medium text-[#F4D6C6]">
                    Interview Round 3
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[#F3ECDE]/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#D4AF83]" />
                    Architecture review • Tomorrow, 2 PM
                  </span>
                  <span className="text-[#A9501C] font-semibold">96% Fit</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[11px] text-[#F3ECDE]/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-[#D4AF83]" />
                  <span>5 Active Applications in Pipeline</span>
                </div>
                <span className="text-white font-medium">$185k - $215k target</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-[#F3ECDE]/70 flex items-center justify-between font-light">
              <span>Crafted for deliberate career growth</span>
              <div className="flex items-center gap-1 text-[#D4AF83]">
                <Check className="h-3.5 w-3.5 text-[#A9501C]" />
                <span>Encrypted JWT Sessions</span>
              </div>
            </div>
          </section>

          {/* Right Column: Clean Professional Sign In Form */}
          <section className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#FAF7F2]/50 dark:bg-[#0F1E2E]">
            <div className="max-w-md w-full mx-auto">
              
              <div className="mb-6">
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#183451] dark:text-white">
                  Sign In
                </h1>
                <p className="mt-1 text-xs text-[#183451]/65 dark:text-[#FAF7F2]/65">
                  Enter your credentials below to access your active job search dashboard.
                </p>
              </div>

              {/* Inline Error Alert */}
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#A9501C]/30 bg-[#FAECE4] dark:bg-[#361508]/60 p-3.5 text-xs text-[#602B13] dark:text-[#F4D6C6] animate-in fade-in duration-150"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#A9501C] mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#183451] dark:text-[#FAF7F2]/90"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#183451]/40 dark:text-[#FAF7F2]/40">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="alex.morgan@example.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#D4AF83]/45 bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#183451] placeholder:text-stone-400 transition-all duration-150 focus:border-[#A9501C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A9501C]/20 dark:border-white/15 dark:bg-[#0B1623] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-[#D4AF83]"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#183451] dark:text-[#FAF7F2]/90"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-[#A9501C] hover:text-[#8E3F14] hover:underline dark:text-[#D4AF83]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#183451]/40 dark:text-[#FAF7F2]/40">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#D4AF83]/45 bg-white py-2.5 pl-10 pr-10 text-sm text-[#183451] placeholder:text-stone-400 transition-all duration-150 focus:border-[#A9501C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A9501C]/20 dark:border-white/15 dark:bg-[#0B1623] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-[#D4AF83]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-[#183451] dark:hover:text-[#FAF7F2] transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-[#D4AF83] text-[#A9501C] focus:ring-[#A9501C] dark:bg-[#0B1623] dark:border-white/20"
                    />
                    <span className="text-xs text-[#183451]/75 dark:text-[#FAF7F2]/75 font-medium">
                      Remember this browser session
                    </span>
                  </label>
                </div>

                {/* Submit Button (Signature Terracotta) */}
                <button
                  type="submit"
                  disabled={loading || demoLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9501C] hover:bg-[#8E3F14] text-[#FAF7F2] py-2.5 px-4 text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FAF7F2] border-t-transparent" />
                      <span>Verifying credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Pipeline</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#D4AF83]/30 dark:bg-white/10" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#183451]/50 dark:text-[#FAF7F2]/40">
                  Candidate Fast-Track
                </span>
                <div className="h-px flex-1 bg-[#D4AF83]/30 dark:bg-white/10" />
              </div>

              {/* 1-Click Professional Studio Demo Button */}
              <button
                type="button"
                onClick={handleInstantDemoLogin}
                disabled={loading || demoLoading}
                className="group flex w-full items-center justify-between rounded-xl border border-[#D4AF83]/50 bg-white/70 dark:bg-[#11253A]/60 p-3.5 text-left transition-all hover:border-[#A9501C] hover:bg-white dark:hover:bg-[#11253A] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#183451] text-[#D4AF83] shadow-sm transition-transform group-hover:scale-105">
                    <Sparkles className="h-4 w-4 text-[#D4AF83]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#183451] dark:text-[#FAF7F2] flex items-center gap-1.5">
                      <span>Explore Preloaded Demo Studio</span>
                      <span className="rounded bg-[#F3ECDE] dark:bg-[#183451] border border-[#D4AF83]/60 px-1.5 py-0.2 text-[9px] font-bold text-[#A9501C] uppercase tracking-wide">
                        1-Click Access
                      </span>
                    </div>
                    <div className="text-[11px] text-[#183451]/60 dark:text-[#FAF7F2]/60 mt-0.5">
                      Pre-populated with 5 applications, interview notes & salary data
                    </div>
                  </div>
                </div>
                {demoLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#A9501C] border-t-transparent" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-[#A9501C] transition-transform group-hover:translate-x-1" />
                )}
              </button>

              <div className="mt-6 text-center text-xs text-[#183451]/70 dark:text-[#FAF7F2]/70">
                New candidate?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#A9501C] hover:text-[#8E3F14] hover:underline dark:text-[#D4AF83]"
                >
                  Create your workspace free
                </Link>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#183451]/50 dark:text-[#FAF7F2]/50 gap-2 relative z-10">
        <div>
          © {new Date().getFullYear()} HireLog Inc. Built with intentional craftsmanship.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#183451]/70 dark:text-[#FAF7F2]/70">
            <ShieldCheck className="h-3.5 w-3.5 text-[#A9501C]" /> Secure Session Auth
          </span>
          <span>•</span>
          <Link to="/login" className="hover:underline">Privacy</Link>
          <span>•</span>
          <Link to="/login" className="hover:underline">Security</Link>
        </div>
      </footer>
    </div>
  );
}
