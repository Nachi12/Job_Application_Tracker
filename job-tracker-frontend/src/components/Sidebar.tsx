import { NavLink } from 'react-router-dom';
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
      className={`hidden md:flex flex-col border-r border-[#D4AF83]/30 bg-white dark:border-white/10 dark:bg-[#0B1623] transition-all duration-200 relative ${
        collapsed ? 'w-16 px-2 py-5' : 'w-56 px-3.5 py-5'
      }`}
    >
      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-[#D4AF83]/60 bg-white text-[#183451] hover:text-[#A9501C] hover:border-[#A9501C] dark:border-white/20 dark:bg-[#0F1E2E] dark:text-[#FAF7F2] transition shadow-xs"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      )}

      {/* Quiet Brand Header */}
      <div className={`mb-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#183451] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#183451] font-serif font-bold text-sm shadow-xs relative">
            <span className="tracking-tighter">H</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#A9501C] -ml-0.5 mt-2" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-serif text-sm font-bold tracking-tight text-[#183451] dark:text-white leading-none">
                HireLog
              </h1>
              <p className="text-[9px] font-semibold text-[#A9501C] uppercase tracking-wider mt-0.5">
                Career OS
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 text-[10px] font-bold text-[#183451]/50 dark:text-[#D4AF83]/60 uppercase tracking-wider mb-1">
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
                    ? 'bg-[#183451]/8 text-[#183451] dark:bg-white/10 dark:text-[#FAF7F2] font-semibold'
                    : 'text-[#183451]/75 hover:bg-[#F3ECDE]/60 hover:text-[#A9501C] dark:text-[#FAF7F2]/75 dark:hover:bg-[#11253A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#A9501C]" />
                  )}
                  <Icon size={15} className={isActive ? 'text-[#A9501C]' : 'text-[#183451]/45 dark:text-[#D4AF83]/70'} />
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
        <div className={`mt-5 mb-1 ${collapsed ? 'hidden' : 'px-3 text-[10px] font-bold text-[#183451]/50 dark:text-[#D4AF83]/60 uppercase tracking-wider'}`}>
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
                    ? 'bg-[#183451]/8 text-[#183451] dark:bg-white/10 dark:text-[#FAF7F2] font-semibold'
                    : 'text-[#183451]/75 hover:bg-[#F3ECDE]/60 hover:text-[#A9501C] dark:text-[#FAF7F2]/75 dark:hover:bg-[#11253A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#A9501C]" />
                  )}
                  <Icon size={15} className={isActive ? 'text-[#A9501C]' : 'text-[#183451]/45 dark:text-[#D4AF83]/70'} />
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