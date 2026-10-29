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
  ShieldCheck,
  AlertCircle,
  Check,
  X,
  Compass,
  Building2,
  Calendar
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
      pushToast('success', 'Workspace established successfully! Welcome to HireLog.');
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
            Already registered?
          </span>
          <Link
            to="/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D4AF83]/60 hover:border-[#A9501C] bg-white/60 dark:bg-[#11253A]/80 text-[#183451] dark:text-[#FAF7F2] transition-all hover:bg-white"
          >
            Sign in
          </Link>
          <DarkModeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-[#D4AF83]/35 dark:border-white/10 bg-white/90 dark:bg-[#0F1E2E]/95 shadow-xl shadow-[#183451]/5 dark:shadow-black/40 overflow-hidden backdrop-blur-sm">
          
          {/* Left Column: Editorial Brand & Values (Riviera Blue) */}
          <section className="lg:col-span-5 bg-[#183451] p-8 sm:p-10 text-[#FAF7F2] relative flex flex-col justify-between overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#F3ECDE_1px,transparent_1px),linear-gradient(to_bottom,#F3ECDE_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#A9501C]/20 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#D4AF83]/30 bg-white/5 text-[#D4AF83] text-[11px] font-medium tracking-wide mb-6">
                <Compass className="h-3.5 w-3.5 text-[#A9501C]" />
                <span>Private Candidate Workspace</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#FAF7F2] leading-snug">
                Step into a disciplined, data-informed job hunt.
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-[#F3ECDE]/75 leading-relaxed font-light">
                Keep every lead organized from first recruiter touch to executed offer letter. Completely private, secure, and built for professionals.
              </p>
            </div>

            <div className="relative z-10 my-8 space-y-2.5">
              {[
                { title: 'Interactive Kanban Pipeline', desc: 'Drag-and-drop progression across 6 stages' },
                { title: 'Job Match & Intelligence AI', desc: 'ATS alignment scores and custom interview questions' },
                { title: 'Executive Analytics', desc: 'Real response rates and stage-by-stage conversion metrics' }
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-[#A9501C]/30 text-[#D4AF83] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#A9501C]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-[11px] text-[#F3ECDE]/65">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-[#F3ECDE]/70 flex items-center justify-between font-light">
              <span>Free for individual job seekers</span>
              <span className="text-[#D4AF83]">No credit card required</span>
            </div>
          </section>

          {/* Right Column: Register Form */}
          <section className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-[#FAF7F2]/50 dark:bg-[#0F1E2E]">
            <div className="max-w-md w-full mx-auto">
              
              <div className="mb-6">
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#183451] dark:text-white">
                  Create Workspace
                </h1>
                <p className="mt-1 text-xs text-[#183451]/65 dark:text-[#FAF7F2]/65">
                  Set up your personal candidate account to track your pipeline.
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

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#183451] dark:text-[#FAF7F2]/90"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#183451]/40 dark:text-[#FAF7F2]/40">
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
                      className="w-full rounded-xl border border-[#D4AF83]/45 bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#183451] placeholder:text-stone-400 transition-all duration-150 focus:border-[#A9501C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A9501C]/20 dark:border-white/15 dark:bg-[#0B1623] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-[#D4AF83]"
                      required
                    />
                  </div>
                </div>

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
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#183451] dark:text-[#FAF7F2]/90"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#183451]/40 dark:text-[#FAF7F2]/40">
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

                  {/* Password Rules Checklist */}
                  {form.password.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl border border-[#D4AF83]/30 bg-white/70 dark:bg-[#0B1623]/70 p-2.5 text-[11px]">
                      <div className={`flex items-center gap-1.5 ${rules.minLength ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-400'}`}>
                        {rules.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>8+ characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${rules.hasUpper ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-400'}`}>
                        {rules.hasUpper ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>1 uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${rules.hasLower ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-400'}`}>
                        {rules.hasLower ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>1 lowercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-400'}`}>
                        {rules.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        <span>1 number</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#183451] dark:text-[#FAF7F2]/90"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#183451]/40 dark:text-[#FAF7F2]/40">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#D4AF83]/45 bg-white py-2.5 pl-10 pr-10 text-sm text-[#183451] placeholder:text-stone-400 transition-all duration-150 focus:border-[#A9501C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A9501C]/20 dark:border-white/15 dark:bg-[#0B1623] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-[#D4AF83]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-[#183451] dark:hover:text-[#FAF7F2] transition-colors"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {form.confirmPassword.length > 0 && (
                    <p className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${rules.matchesConfirm ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#A9501C]'}`}>
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
                      className="mt-0.5 h-4 w-4 rounded border-[#D4AF83] text-[#A9501C] focus:ring-[#A9501C] dark:bg-[#0B1623] dark:border-white/20"
                    />
                    <span className="text-xs text-[#183451]/75 dark:text-[#FAF7F2]/75">
                      I agree to the deliberate job search guidelines and terms of service.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9501C] hover:bg-[#8E3F14] text-[#FAF7F2] py-2.5 px-4 text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FAF7F2] border-t-transparent" />
                      <span>Creating your workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Establish Free Workspace</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-[#183451]/70 dark:text-[#FAF7F2]/70">
                Already have a workspace?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#A9501C] hover:text-[#8E3F14] hover:underline dark:text-[#D4AF83]"
                >
                  Sign in to your pipeline
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
