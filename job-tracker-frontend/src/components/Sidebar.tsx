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
  ChevronRight,
  Zap
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
      className={`hidden md:flex flex-col border-r border-violet-100 bg-white dark:border-haiti-800 dark:bg-haiti-950 transition-all duration-300 relative ${
        collapsed ? 'w-20 px-2 py-6' : 'w-60 px-4 py-6'
      }`}
    >
      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-7 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-violet-200 bg-white text-slate-500 shadow-xs hover:text-violet-600 dark:border-haiti-800 dark:bg-haiti-900 dark:text-haiti-200 transition"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}

      {/* Brand Header */}
      <div className={`mb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white font-extrabold text-sm shadow-violet-glow">
            HL
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-haiti-900 dark:text-white">
                HireLog
              </h1>
              <p className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest flex items-center gap-1">
                <Zap size={9} className="fill-turbo-500 text-turbo-500" /> AI JOB OS
              </p>
            </div>
          )}
        </div>
        {!collapsed && <span className="quantus-badge-turbo">2025</span>}
      </div>

      {/* Workspace Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-haiti-300 uppercase tracking-widest mb-1">
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
                `relative flex items-center gap-3 rounded-xl transition-all duration-150 text-xs font-semibold ${
                  collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300 font-bold'
                    : 'text-slate-600 hover:bg-violet-50/60 hover:text-violet-600 dark:text-haiti-300 dark:hover:bg-haiti-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-violet-500" />
                  )}
                  <Icon size={16} className={isActive ? 'text-violet-500' : 'text-slate-400 dark:text-haiti-300'} />
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
        <div className={`mt-6 mb-1 ${collapsed ? 'hidden' : 'px-3 text-[10px] font-bold text-slate-400 dark:text-haiti-300 uppercase tracking-widest'}`}>
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
                `relative flex items-center gap-3 rounded-xl transition-all duration-150 text-xs font-semibold ${
                  collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300 font-bold'
                    : 'text-slate-600 hover:bg-violet-50/60 hover:text-violet-600 dark:text-haiti-300 dark:hover:bg-haiti-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-violet-500" />
                  )}
                  <Icon size={16} className={isActive ? 'text-violet-500' : 'text-slate-400 dark:text-haiti-300'} />
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