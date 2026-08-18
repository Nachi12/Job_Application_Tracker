import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Sparkles,
  Kanban,
  BookOpen,
  FileText,
  BarChart3,
  Bell,
  User,
  X,
  Command
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAddJob?: () => void;
}

export default function CommandPalette({ open, onClose, onOpenAddJob }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const actions = [
    {
      id: 'add-job',
      title: 'Add New Job Application',
      category: 'Actions',
      icon: Plus,
      run: () => {
        onClose();
        if (onOpenAddJob) onOpenAddJob();
        else navigate('/applications');
      }
    },
    {
      id: 'analyze-job',
      title: 'Analyze Target Job Description',
      category: 'AI Tools',
      icon: Sparkles,
      badge: 'AI',
      run: () => {
        onClose();
        navigate('/intelligence');
      }
    },
    {
      id: 'open-kanban',
      title: 'View Application Kanban Board',
      category: 'Navigation',
      icon: Kanban,
      run: () => {
        onClose();
        navigate('/kanban');
      }
    },
    {
      id: 'interview-prep',
      title: 'Practice AI Interview Questions',
      category: 'Navigation',
      icon: BookOpen,
      run: () => {
        onClose();
        navigate('/interview-prep');
      }
    },
    {
      id: 'resumes',
      title: 'Manage Resume Versions',
      category: 'Navigation',
      icon: FileText,
      run: () => {
        onClose();
        navigate('/resumes');
      }
    },
    {
      id: 'analytics',
      title: 'View Pipeline Funnel & Analytics',
      category: 'Navigation',
      icon: BarChart3,
      run: () => {
        onClose();
        navigate('/analytics');
      }
    },
    {
      id: 'reminders',
      title: 'Manage Follow-up Reminders',
      category: 'Navigation',
      icon: Bell,
      run: () => {
        onClose();
        navigate('/reminders');
      }
    },
    {
      id: 'profile',
      title: 'View Career Profile & Settings',
      category: 'Account',
      icon: User,
      run: () => {
        onClose();
        navigate('/profile');
      }
    }
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-haiti-950/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl border border-violet-200 bg-white dark:border-haiti-800 dark:bg-haiti-900 shadow-2xl overflow-hidden animate-fade-scale">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-violet-100 dark:border-haiti-800">
          <Search size={18} className="text-violet-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, tools, or shortcuts... (Cmd+K)"
            className="w-full bg-transparent text-sm text-haiti-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden font-medium"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-haiti-900 dark:hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching commands or actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.run}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-haiti-900 dark:text-haiti-100 hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-haiti-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-violet-50 text-violet-500 dark:bg-haiti-800">
                      <Icon size={16} />
                    </div>
                    <span>{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="quantus-badge-turbo">{item.badge}</span>
                    )}
                    <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">{item.category}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-chalk dark:bg-haiti-950 border-t border-violet-100 dark:border-haiti-800 flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <Command size={10} /> <span>Press Esc to exit</span>
          </div>
          <div>HireLog AI Command Center</div>
        </div>
      </div>
    </div>
  );
}
