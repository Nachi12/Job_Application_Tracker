import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CommandPalette from '../components/CommandPalette';
import JobFormModal from '../components/JobFormModal';
import { useJobsContext } from '../context/JobsContext';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  Sparkles,
  BookOpen,
  FileText,
  BarChart3,
  Bell,
  User,
  Settings,
  X,
  LogOut,
  Zap
} from 'lucide-react';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { create } = useJobsContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateJob = async (data: any) => {
    await create(data);
    setAddModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/kanban', label: 'Kanban Pipeline', icon: Kanban },
    { to: '/intelligence', label: 'Job Intelligence', icon: Sparkles, badge: 'AI' },
    { to: '/interview-prep', label: 'Interview Prep', icon: BookOpen },
    { to: '/resumes', label: 'Resumes', icon: FileText },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/reminders', label: 'Reminders', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-chalk text-haiti-900 dark:bg-haiti-950 dark:text-haiti-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-haiti-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-haiti-950 h-full p-5 shadow-2xl flex flex-col justify-between z-10 animate-fade-scale">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-violet-100 dark:border-haiti-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white font-extrabold text-sm shadow-violet-glow">
                    HL
                  </div>
                  <div>
                    <h1 className="text-base font-extrabold tracking-tight text-haiti-900 dark:text-white">
                      HireLog
                    </h1>
                    <p className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest flex items-center gap-1">
                      <Zap size={9} className="fill-turbo-500 text-turbo-500" /> AI JOB OS
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-haiti-900 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300 font-bold'
                            : 'text-slate-600 dark:text-haiti-300 hover:bg-violet-50'
                        }`
                      }
                    >
                      <Icon size={16} className="text-violet-500" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && <span className="quantus-badge-turbo">{item.badge}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-violet-100 dark:border-haiti-800 space-y-3">
              <div className="flex items-center gap-2.5 px-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white font-bold text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-bold text-haiti-900 dark:text-white">{user?.name}</p>
                  <p className="truncate text-[10px] text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs dark:bg-rose-950/40 dark:text-rose-400"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenAddJob={() => setAddModalOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-20 md:pb-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Sticky Mobile Bottom Quick Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-violet-100 dark:bg-haiti-950/90 dark:border-haiti-800 flex items-center justify-around py-2 px-1">
          {[
            { to: '/', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/applications', label: 'Jobs', icon: Briefcase },
            { to: '/kanban', label: 'Kanban', icon: Kanban },
            { to: '/intelligence', label: 'AI Suite', icon: Sparkles },
            { to: '/profile', label: 'Profile', icon: User }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition ${
                    isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-haiti-300'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenAddJob={() => setAddModalOpen(true)}
      />

      {/* Global Add Application Modal */}
      <JobFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}