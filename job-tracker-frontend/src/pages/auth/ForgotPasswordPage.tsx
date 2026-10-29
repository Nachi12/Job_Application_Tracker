import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import DarkModeToggle from '../../components/DarkModeToggle';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

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
        'If an account exists for that email, recovery instructions have been sent.'
      );
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to send reset link';
      pushToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#11253A] dark:bg-[#0B1623] dark:text-[#FAF7F2] transition-colors duration-200 flex flex-col justify-between selection:bg-[#D4AF83]/30 selection:text-[#183451]">
      {/* Header */}
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
              Recovery
            </span>
          </div>
        </Link>
        <DarkModeToggle />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md rounded-3xl border border-[#D4AF83]/40 dark:border-white/10 bg-white/95 dark:bg-[#0F1E2E]/95 p-8 sm:p-10 shadow-xl shadow-[#183451]/5 dark:shadow-black/40 backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#183451] dark:text-white">
              Reset Password
            </h1>
            <p className="mt-1.5 text-xs text-[#183451]/65 dark:text-[#FAF7F2]/65">
              Enter your registered email address and we'll transmit a secure access link.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-300/60 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Instructions Dispatched</div>
                  <div className="mt-1 text-[12px] leading-relaxed opacity-90">
                    If an active profile exists for <strong>{email}</strong>, you will receive password reset instructions within moments.
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9501C] hover:bg-[#8E3F14] text-[#FAF7F2] py-2.5 px-4 text-sm font-semibold shadow-sm transition hover:shadow active:scale-[0.99]"
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.morgan@example.com"
                    className="w-full rounded-xl border border-[#D4AF83]/45 bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#183451] placeholder:text-stone-400 transition-all duration-150 focus:border-[#A9501C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A9501C]/20 dark:border-white/15 dark:bg-[#0B1623] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-[#D4AF83]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9501C] hover:bg-[#8E3F14] text-[#FAF7F2] py-2.5 px-4 text-sm font-semibold shadow-sm transition-all duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FAF7F2] border-t-transparent" />
                    <span>Transmitting recovery link...</span>
                  </>
                ) : (
                  <>
                    <span>Transmit Recovery Link</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183451]/70 hover:text-[#A9501C] dark:text-[#FAF7F2]/70 dark:hover:text-[#D4AF83] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#183451]/50 dark:text-[#FAF7F2]/50 gap-2 relative z-10">
        <div>© {new Date().getFullYear()} HireLog Inc.</div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#A9501C]" />
          <span>Encrypted Account Security</span>
        </div>
      </footer>
    </div>
  );
}
