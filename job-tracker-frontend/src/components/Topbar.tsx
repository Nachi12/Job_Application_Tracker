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
    <header className="flex items-center justify-between border-b border-[#D4AF83]/30 bg-white/95 backdrop-blur-xs px-4 md:px-6 py-3 dark:border-white/10 dark:bg-[#0B1623]/95 sticky top-0 z-30">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF83]/50 bg-[#FAF7F2] text-[#183451] dark:border-white/15 dark:bg-[#11253A] dark:text-white"
            title="Open Mobile Navigation"
          >
            <Menu size={16} />
          </button>
        )}
        <div>
          <h2 className="font-serif text-sm md:text-base font-bold tracking-tight text-[#183451] dark:text-[#FAF7F2]">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Center Search Launcher */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 w-72 rounded-lg border border-[#D4AF83]/50 bg-[#FAF7F2] px-3 py-1.5 text-xs text-stone-600 hover:border-[#A9501C] transition dark:border-white/15 dark:bg-[#11253A] dark:text-stone-300"
        >
          <Search size={14} className="text-[#A9501C]" />
          <span className="flex-1 text-left font-normal">Search applications, roles...</span>
          <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 border border-[#D4AF83]/40 dark:border-white/15 dark:bg-[#0B1623]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF83]/50 bg-[#FAF7F2] text-[#A9501C] dark:border-white/15 dark:bg-[#11253A]"
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
          className="hidden items-center gap-2 md:flex p-1 rounded-lg hover:bg-[#F3ECDE]/60 dark:hover:bg-[#11253A] transition cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#183451] dark:bg-[#FAF7F2] text-xs font-serif font-bold text-[#FAF7F2] dark:text-[#183451] shadow-xs">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span className="text-xs font-semibold text-[#183451] dark:text-[#FAF7F2]">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="hidden sm:flex items-center justify-center p-2 rounded-lg border border-[#D4AF83]/40 bg-[#FAF7F2] text-stone-500 hover:text-rose-600 dark:border-white/15 dark:bg-[#11253A] dark:text-stone-300 transition"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}