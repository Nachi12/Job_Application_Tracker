import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import DarkModeToggle from '../../components/DarkModeToggle';
import { Mail, ArrowRight, Briefcase, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { pushToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    setLoading(true);
    try {
      await authService.forgotPassword(cleanEmail);
      setSubmitted(true);
      pushToast(
        'success',
        'If an account exists for that email, a password reset link has been dispatched.'
      );
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to send reset link';
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
              Account Recovery
            </span>
          </div>
        </div>

        {/* Card */}
        <section className="relative rounded-3xl border border-violet-100/90 bg-white/95 p-7 sm:p-8 shadow-2xl shadow-violet-900/5 backdrop-blur-xl transition-all dark:border-violet-900/30 dark:bg-[#150D27]/95 dark:shadow-2xl dark:shadow-black/60">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reset password
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-violet-200/60">
              Enter the email associated with your account and we’ll send you a recovery link.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-semibold">Reset instructions sent</div>
                  <div className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                    If an account with <strong>{email}</strong> exists, you will receive an email shortly with instructions to reset your password.
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 px-4 text-sm font-semibold text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-500"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-violet-900/40 dark:bg-[#0B0617]/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-400 dark:focus:bg-[#0B0617]"
                  />
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
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
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
          )}
        </section>
      </main>
    </div>
  );
}
