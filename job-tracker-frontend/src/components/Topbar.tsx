import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { Search, Sparkles, LogOut, Plus, Menu } from 'lucide-react';

interface TopbarProps {
  onOpenCommandPalette?: () => void;
  onOpenAddJob?: () => void;
  onToggleMobileMenu?: () => void;
}

export default function Topbar({ onOpenCommandPalette, onOpenAddJob, onToggleMobileMenu }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/applications') return 'Applications';
    if (path === '/kanban') return 'Kanban Pipeline';
    if (path === '/intelligence') return 'Job Intelligence';
    if (path === '/interview-prep') return 'Interview Prep';
    if (path === '/resumes') return 'Resumes';
    if (path === '/analytics') return 'Analytics';
    if (path === '/reminders') return 'Reminders';
    if (path === '/profile') return 'Profile';
    if (path === '/settings') return 'Settings';
    return 'HireLog OS';
  };

  return (
    <header className="flex items-center justify-between border-b border-violet-100 bg-white/80 backdrop-blur-md px-4 md:px-6 py-3 dark:border-haiti-800 dark:bg-haiti-950/80 sticky top-0 z-30">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200 bg-chalk text-haiti-900 dark:border-haiti-800 dark:bg-haiti-900 dark:text-white"
            title="Open Mobile Navigation"
          >
            <Menu size={18} />
          </button>
        )}
        <div>
          <h2 className="text-sm md:text-base font-extrabold tracking-tight text-haiti-900 dark:text-white">
            {getPageTitle()}
          </h2>
          <p className="text-[10px] md:text-[11px] font-semibold text-violet-600 dark:text-violet-400">
            Good evening, {user?.name?.split(' ')[0] || 'User'}
          </p>
        </div>
      </div>

      {/* Center Search / Cmd+K Launcher */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 w-80 rounded-xl border border-violet-200 bg-chalk px-3.5 py-1.5 text-xs text-slate-500 hover:border-violet-400 transition dark:border-haiti-800 dark:bg-haiti-900 dark:text-haiti-300"
        >
          <Search size={14} className="text-violet-500" />
          <span className="flex-1 text-left">Search applications, roles...</span>
          <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-violet-100 dark:border-haiti-800 dark:bg-haiti-950">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-xl border border-violet-200 bg-chalk text-violet-500 dark:border-haiti-800 dark:bg-haiti-900"
          title="Search (Cmd+K)"
        >
          <Search size={15} />
        </button>

        {/* AI Action Button */}
        <button
          onClick={() => navigate('/intelligence')}
          className="flex items-center gap-1.5 rounded-xl bg-violet-500 px-2.5 md:px-3 py-1.5 text-xs font-bold text-white shadow-violet-glow hover:bg-violet-600 transition"
        >
          <Sparkles size={13} className="text-turbo-500 fill-turbo-500" />
          <span className="hidden sm:inline">HireLog AI</span>
        </button>

        {/* Quick Add Job Button */}
        {onOpenAddJob && (
          <button
            onClick={onOpenAddJob}
            className="flex items-center gap-1 rounded-xl bg-turbo-500 px-2.5 md:px-3 py-1.5 text-xs font-black text-haiti-900 hover:bg-turbo-400 transition shadow-turbo-glow"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Job</span>
          </button>
        )}

        {/* Dark mode */}
        <DarkModeToggle />

        {/* User Info Avatar Button -> Navigates to Profile */}
        <NavLink
          to="/profile"
          title="Open Profile Settings"
          className="hidden items-center gap-2.5 md:flex p-1 rounded-xl hover:bg-violet-50 dark:hover:bg-haiti-900 transition cursor-pointer group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500 text-xs font-bold text-white shadow-xs group-hover:scale-105 transition">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          <div className="leading-tight text-left">
            <p className="text-xs font-bold text-haiti-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-haiti-300">
              {user?.email}
            </p>
          </div>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="hidden sm:flex items-center justify-center p-2 rounded-xl border border-violet-200 bg-chalk text-slate-500 hover:text-rose-600 dark:border-haiti-800 dark:bg-haiti-900 dark:text-haiti-300 transition"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}