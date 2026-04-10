interface Props {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, pageSize, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <div>
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs disabled:opacity-50 dark:border-slate-700"
        >
          Previous
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-md border border-slate-200 px-2 py-1 text-xs disabled:opacity-50 dark:border-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}