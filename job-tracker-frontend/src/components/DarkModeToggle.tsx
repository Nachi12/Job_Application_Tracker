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
      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-sand-300/80 bg-white/90 text-riviera-800 shadow-sm backdrop-blur-md transition-all hover:border-sand-400 hover:bg-ivory-100 dark:border-riviera-700/80 dark:bg-riviera-900/90 dark:text-sand-300 dark:hover:border-sand-400/40 dark:hover:bg-riviera-800"
      title={theme === 'dark' ? 'Switch to daylight theme' : 'Switch to evening theme'}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-terracotta-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-riviera-800 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}