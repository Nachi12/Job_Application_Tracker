import { useState } from 'react';
import { useToastContext } from '../context/ToastContext';
import { Settings, User, Bell, Sparkles, Shield, Palette, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { pushToast } = useToastContext();
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'notifications' | 'ai' | 'security' | 'danger'>('account');

  // AI Preferences
  const [autoTailor, setAutoTailor] = useState(true);
  const [modelTemperature, setModelTemperature] = useState('0.2');

  const handleSaveSettings = () => {
    pushToast('success', 'Settings updated successfully');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="border-b border-violet-100 dark:border-haiti-800 pb-5">
        <h1 className="text-2xl font-extrabold text-haiti-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="text-violet-500" size={24} /> Application & System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-haiti-300 font-medium mt-1">
          Manage your account, AI preferences, notifications, and application settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Settings Navigation Tabs */}
        <div className="space-y-1">
          {[
            { id: 'account', label: 'Account', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'ai', label: 'AI Preferences', icon: Sparkles, badge: 'AI' },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-violet-500 text-white shadow-violet-glow font-bold'
                    : 'text-slate-600 dark:text-haiti-300 hover:bg-violet-50 dark:hover:bg-haiti-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className={isActive ? 'bg-white text-haiti-900 font-bold text-[9px] px-1.5 py-0.5 rounded-md' : 'quantus-badge-turbo'}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 quantus-card p-6 space-y-5">
          {activeTab === 'account' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white">Account Details</h3>
              <p className="text-slate-500 dark:text-haiti-300">Manage your basic profile preferences and data export.</p>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-bold text-haiti-900 dark:text-white mb-1">Timezone</label>
                  <select className="w-full rounded-xl border border-violet-200 bg-chalk p-2.5 font-semibold text-haiti-900 dark:border-haiti-800 dark:bg-haiti-950 dark:text-white">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>IST (Indian Standard Time)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-3">
                <button onClick={handleSaveSettings} className="quantus-btn-primary px-4 py-2">
                  Save Account Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" /> AI Assistant Preferences
                </h3>
                <span className="quantus-badge-turbo">GEMINI 2.5</span>
              </div>
              <p className="text-slate-500 dark:text-haiti-300">Configure strict temperature and grounding behavior for LLM generations.</p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-950">
                  <div>
                    <div className="font-bold text-haiti-900 dark:text-white">Auto-generate Cover Letter Snippets</div>
                    <div className="text-[11px] text-slate-500">Automatically draft cover letters when new applications are saved.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoTailor}
                    onChange={(e) => setAutoTailor(e.target.checked)}
                    className="h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-haiti-900 dark:text-white mb-1">Model Temperature (Creativity vs Determinism)</label>
                  <select
                    value={modelTemperature}
                    onChange={(e) => setModelTemperature(e.target.value)}
                    className="w-full rounded-xl border border-violet-200 bg-chalk p-2.5 font-semibold text-haiti-900 dark:border-haiti-800 dark:bg-haiti-950 dark:text-white"
                  >
                    <option value="0.1">0.1 - Extremely Strict / ATS Grounded</option>
                    <option value="0.2">0.2 - Standard Recommended (Balanced)</option>
                    <option value="0.5">0.5 - Creative Phrasing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button onClick={handleSaveSettings} className="quantus-btn-primary px-4 py-2">
                  Save AI Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white">Appearance & Theme</h3>
              <p className="text-slate-500 dark:text-haiti-300">HireLog uses Quantus Palette 2025 across light and dark modes.</p>
              <div className="p-4 rounded-xl border border-violet-100 bg-chalk dark:border-haiti-800 dark:bg-haiti-950 space-y-2">
                <div className="font-bold text-violet-600 dark:text-violet-400">Quantus Theme Applied</div>
                <div className="text-[11px] text-slate-500">Electric Violet (#834DFB) & Turbo (#F0E100) are active.</div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-rose-600">Danger Zone</h3>
              <p className="text-slate-500 dark:text-haiti-300">Irreversible actions on your account and data.</p>
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-950 dark:bg-rose-950/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-700 dark:text-rose-300">Purge Application History</div>
                  <div className="text-[11px] text-rose-600/80">Permanently remove all job tracking records.</div>
                </div>
                <button onClick={() => alert('Action blocked in demo workspace.')} className="px-3.5 py-1.5 rounded-xl bg-rose-600 font-bold text-white text-xs hover:bg-rose-700">
                  Delete All Data
                </button>
              </div>
            </div>
          )}

          {['notifications', 'security'].includes(activeTab) && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-haiti-900 dark:text-white capitalize">{activeTab} Settings</h3>
              <p className="text-slate-500 dark:text-haiti-300">Default security and notification rules are active.</p>
              <div className="flex justify-end pt-3">
                <button onClick={handleSaveSettings} className="quantus-btn-primary px-4 py-2">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
