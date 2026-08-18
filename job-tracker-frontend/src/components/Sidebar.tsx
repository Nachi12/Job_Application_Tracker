import { NavLink } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth();

  const workspaceItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/kanban', label: 'Kanban Pipeline', icon: Kanban },
    { to: '/intelligence', label: 'Job Intelligence', icon: Sparkles, badge: 'AI' },
    { to: '/interview-prep', label: 'Interview Prep', icon: BookOpen },
    { to: '/resumes', label: 'Resumes', icon: FileText },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/reminders', label: 'Reminders', icon: Bell }
  ];

  const accountItems = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-violet-100 bg-white dark:border-haiti-800 dark:bg-haiti-950 transition-all duration-200 relative ${
        collapsed ? 'w-16 px-2 py-5' : 'w-56 px-3.5 py-5'
      }`}
    >
      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-violet-200 bg-white text-slate-400 hover:text-violet-600 dark:border-haiti-800 dark:bg-haiti-900 dark:text-haiti-300 transition"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      )}

      {/* Quiet Brand Header */}
      <div className={`mb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-white font-bold text-xs">
            HL
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold tracking-tight text-haiti-900 dark:text-white">
                HireLog
              </h1>
              <p className="text-[9px] font-semibold text-slate-400 dark:text-haiti-300 uppercase tracking-wider">
                Job Search OS
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-haiti-300 uppercase tracking-wider mb-1">
            Workspace
          </div>
        )}
        {workspaceItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 rounded-lg transition-all duration-150 text-xs font-medium ${
                  collapsed ? 'justify-center p-2' : 'px-3 py-2'
                } ${
                  isActive
                    ? 'bg-violet-500/8 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300 font-semibold'
                    : 'text-slate-600 hover:bg-violet-50/50 hover:text-violet-600 dark:text-haiti-300 dark:hover:bg-haiti-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-violet-500" />
                  )}
                  <Icon size={15} className={isActive ? 'text-violet-500' : 'text-slate-400 dark:text-haiti-300'} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="quantus-badge-turbo">{item.badge}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Account Section */}
        <div className={`mt-5 mb-1 ${collapsed ? 'hidden' : 'px-3 text-[10px] font-bold text-slate-400 dark:text-haiti-300 uppercase tracking-wider'}`}>
          Account
        </div>
        {accountItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 rounded-lg transition-all duration-150 text-xs font-medium ${
                  collapsed ? 'justify-center p-2' : 'px-3 py-2'
                } ${
                  isActive
                    ? 'bg-violet-500/8 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300 font-semibold'
                    : 'text-slate-600 hover:bg-violet-50/50 hover:text-violet-600 dark:text-haiti-300 dark:hover:bg-haiti-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-violet-500" />
                  )}
                  <Icon size={15} className={isActive ? 'text-violet-500' : 'text-slate-400 dark:text-haiti-300'} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}