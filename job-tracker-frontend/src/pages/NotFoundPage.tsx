import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-center text-sm dark:bg-slate-950">
      <div className="mb-2 text-3xl font-bold">404</div>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark"
      >
        Back to dashboard
      </Link>
    </div>
  );
}