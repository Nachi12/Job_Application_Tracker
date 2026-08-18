import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { Search, LogOut, Plus, Menu } from 'lucide-react';

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
    return 'HireLog';
  };

  return (
    <header className="flex items-center justify-between border-b border-violet-100 bg-white/90 backdrop-blur-xs px-4 md:px-6 py-3 dark:border-haiti-800 dark:bg-haiti-950/90 sticky top-0 z-30">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-chalk text-haiti-900 dark:border-haiti-800 dark:bg-haiti-900 dark:text-white"
            title="Open Mobile Navigation"
          >
            <Menu size={16} />
          </button>
        )}
        <div>
          <h2 className="text-sm md:text-base font-bold tracking-tight text-haiti-900 dark:text-white">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Center Search Launcher */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 w-72 rounded-lg border border-violet-200 bg-chalk px-3 py-1.5 text-xs text-slate-500 hover:border-violet-300 transition dark:border-haiti-800 dark:bg-haiti-900 dark:text-haiti-300"
        >
          <Search size={14} className="text-violet-500" />
          <span className="flex-1 text-left font-normal">Search applications, roles...</span>
          <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-violet-100 dark:border-haiti-800 dark:bg-haiti-950">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-violet-200 bg-chalk text-violet-500 dark:border-haiti-800 dark:bg-haiti-900"
          title="Search (Cmd+K)"
        >
          <Search size={14} />
        </button>

        {/* Quick Add Job Button */}
        {onOpenAddJob && (
          <button
            onClick={onOpenAddJob}
            className="quantus-btn-primary flex items-center gap-1 text-xs"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Application</span>
          </button>
        )}

        {/* Dark mode */}
        <DarkModeToggle />

        {/* User Profile Link */}
        <NavLink
          to="/profile"
          title="Open Profile Settings"
          className="hidden items-center gap-2 md:flex p-1 rounded-lg hover:bg-violet-50 dark:hover:bg-haiti-900 transition cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 text-xs font-semibold text-white">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-semibold text-haiti-900 dark:text-white">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="hidden sm:flex items-center justify-center p-2 rounded-lg border border-violet-200 bg-chalk text-slate-500 hover:text-rose-600 dark:border-haiti-800 dark:bg-haiti-900 dark:text-haiti-300 transition"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}