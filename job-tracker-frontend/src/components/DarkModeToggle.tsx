import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // ✅ RUN ONLY ONCE
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';

    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []); // 🔥 EMPTY DEPENDENCY (IMPORTANT)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-violet-200/80 bg-white/80 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:border-violet-400 hover:bg-white hover:text-violet-600 dark:border-violet-900/50 dark:bg-[#18102B]/80 dark:text-violet-200 dark:hover:border-violet-700 dark:hover:text-white"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" /> : <Moon className="h-4 w-4 text-violet-600 transition-transform duration-200 hover:-rotate-12" />}
    </button>
  );
}