import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/authService';
import DarkModeToggle from '../../components/DarkModeToggle';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, X, AlertCircle, ShieldCheck } from 'lucide-react';

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
      setErrorMessage('Reset token is missing or has expired.');
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
        err?.response?.data?.error || 'Failed to reset password. The security token may have expired.';
      setErrorMessage(msg);
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
              Security
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
              Set New Password
            </h1>
            <p className="mt-1.5 text-xs text-[#183451]/65 dark:text-[#FAF7F2]/65">
              Establish a secure new password for your candidate account.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#A9501C]/30 bg-[#FAECE4] dark:bg-[#361508]/60 p-3.5 text-xs text-[#602B13] dark:text-[#F4D6C6]"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-[#A9501C] mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#183451] dark:text-[#FAF7F2]/90"
              >
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#183451]/40 dark:text-[#FAF7F2]/40">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#D4AF83]/45 bg-white py-2.5 pl-10 pr-10 text-sm text-[#183451] placeholder:text-stone-400 transition-all duration-150 focus:border-[#A9501C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A9501C]/20 dark:border-white/15 dark:bg-[#0B1623] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-[#D4AF83]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-[#183451] dark:hover:text-[#FAF7F2] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

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

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-[#183451] dark:text-[#FAF7F2]/90"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#183451]/40 dark:text-[#FAF7F2]/40">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#D4AF83]/45 bg-white py-2.5 pl-10 pr-10 text-sm text-[#183451] placeholder:text-stone-400 transition-all duration-150 focus:border-[#A9501C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A9501C]/20 dark:border-white/15 dark:bg-[#0B1623] dark:text-white dark:placeholder:text-stone-500 dark:focus:border-[#D4AF83]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-[#183451] dark:hover:text-[#FAF7F2] transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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
                  <span>Updating security credentials...</span>
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
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183451]/70 hover:text-[#A9501C] dark:text-[#FAF7F2]/70 dark:hover:text-[#D4AF83] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
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
