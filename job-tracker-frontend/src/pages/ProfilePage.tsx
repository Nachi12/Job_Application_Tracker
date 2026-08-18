import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../context/ToastContext';
import { User, Award, Shield, CheckCircle2, Sparkles, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { pushToast } = useToastContext();

  const [name, setName] = useState(user?.name ?? '');
  const [title, setTitle] = useState('Senior Full Stack Developer');
  const [location, setLocation] = useState('San Francisco, CA (Remote)');
  const [saving, setSaving] = useState(false);

  const completionPercentage = 85;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      pushToast('success', 'Profile updated successfully');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="border-b border-violet-100 dark:border-haiti-800 pb-5">
        <h1 className="text-2xl font-extrabold text-haiti-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="text-violet-500" size={24} /> Career Profile & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-haiti-300 font-medium mt-1">
          Maintain your professional identity and skills profile for AI matching.
        </p>
      </div>

      {/* Profile Completeness Banner */}
      <div className="quantus-card p-6 border-l-4 border-l-violet-500 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-violet-500" />
            <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white">Profile Completeness</h3>
          </div>
          <span className="text-sm font-black text-violet-600 dark:text-violet-400">{completionPercentage}% Complete</span>
        </div>

        <div className="w-full bg-chalk dark:bg-haiti-950 h-2.5 rounded-full overflow-hidden border border-violet-100 dark:border-haiti-800">
          <div className="bg-violet-500 h-full rounded-full transition-all duration-500 shadow-violet-glow" style={{ width: `${completionPercentage}%` }} />
        </div>

        <p className="text-xs text-slate-500 dark:text-haiti-300">
          💡 Add 3 target technical skills to improve your AI Job Match accuracy score.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details Form */}
        <form onSubmit={handleProfileSave} className="md:col-span-2 quantus-card p-6 space-y-4 text-xs">
          <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white">Personal Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-haiti-900 dark:text-white mb-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-violet-200 bg-chalk p-2.5 font-semibold text-haiti-900 focus:border-violet-500 focus:outline-hidden dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-haiti-900 dark:text-white mb-1">Account Email</label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full rounded-xl border border-violet-100 bg-slate-100 p-2.5 font-semibold text-slate-400 dark:border-haiti-800 dark:bg-haiti-950 dark:text-slate-500"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-bold text-haiti-900 dark:text-white mb-1">Professional Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-violet-200 bg-chalk p-2.5 font-semibold text-haiti-900 focus:border-violet-500 focus:outline-hidden dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-haiti-900 dark:text-white mb-1">Preferred Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-violet-200 bg-chalk p-2.5 font-semibold text-haiti-900 focus:border-violet-500 focus:outline-hidden dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="quantus-btn-primary px-5 py-2 text-xs"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Subscription Sidebar Card */}
        <div className="quantus-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white flex items-center gap-1.5">
              <Award size={16} className="text-violet-500" /> Plan & Status
            </h3>
            <span className="quantus-badge-turbo">PRO OS</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-haiti-300 leading-relaxed">
            You are currently on the <strong>Pro AI Job OS Plan</strong> with unlimited application tracking and full Gemini AI suite.
          </p>

          <div className="rounded-xl border border-violet-200 bg-chalk p-3.5 dark:border-haiti-800 dark:bg-haiti-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-haiti-900 dark:text-white">
              <CheckCircle2 size={14} className="text-emerald-500" /> Unlimited Job Tracking
            </div>
            <div className="flex items-center gap-2 font-bold text-haiti-900 dark:text-white">
              <CheckCircle2 size={14} className="text-emerald-500" /> AI Resume Match & Prep
            </div>
            <div className="flex items-center gap-2 font-bold text-haiti-900 dark:text-white">
              <CheckCircle2 size={14} className="text-emerald-500" /> Priority Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}