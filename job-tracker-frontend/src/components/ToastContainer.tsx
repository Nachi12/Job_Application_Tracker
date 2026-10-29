import { useToastContext } from '../context/ToastContext';

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-lg px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-900/90 dark:text-emerald-50'
              : toast.type === 'error'
              ? 'bg-rose-50 text-rose-900 dark:bg-rose-900/90 dark:text-rose-50'
              : 'bg-slate-50 text-slate-900 dark:bg-slate-800/90 dark:text-slate-50'
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}