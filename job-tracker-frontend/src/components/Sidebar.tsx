import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  Calendar,
  BarChart3,
  User
} from 'lucide-react';

const baseLink =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200';

const activeLink =
  'bg-gray-100 text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white';

const inactiveLink =
  'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/kanban', label: 'Kanban', icon: Kanban },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900 md:flex">
      
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-xs font-semibold text-white dark:bg-white dark:text-black">
          JT
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">
            JobTracker
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.subscriptionPlan === 'PRO'
              ? 'Pro workspace'
              : 'Free workspace'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive ? activeLink : inactiveLink
                }`
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section (Upgrade CTA) */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Upgrade to unlock analytics & priority tracking
        </p>
        <button className="mt-3 w-full rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black">
          Upgrade Plan
        </button>
      </div>
    </aside>
  );
}