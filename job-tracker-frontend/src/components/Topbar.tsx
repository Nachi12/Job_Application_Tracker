import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { LogOut } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
      
      {/* Left */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Keep track of every application.
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Dark mode */}
        <DarkModeToggle />

        {/* User */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
}