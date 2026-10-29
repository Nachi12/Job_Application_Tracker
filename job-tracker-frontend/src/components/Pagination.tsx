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
          className="rounded-lg border border-[#D4AF83]/50 bg-white/60 dark:bg-[#11253A] px-2.5 py-1 text-xs text-[#183451] dark:text-[#FAF7F2] hover:border-[#A9501C] hover:text-[#A9501C] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg border border-[#D4AF83]/50 bg-white/60 dark:bg-[#11253A] px-2.5 py-1 text-xs text-[#183451] dark:text-[#FAF7F2] hover:border-[#A9501C] hover:text-[#A9501C] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}