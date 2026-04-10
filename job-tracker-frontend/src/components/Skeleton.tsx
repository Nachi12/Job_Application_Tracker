export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-2">
        <div className="h-4 w-24 skeleton" />
      </td>
      <td className="px-3 py-2">
        <div className="h-4 w-20 skeleton" />
      </td>
      <td className="px-3 py-2">
        <div className="h-4 w-16 skeleton" />
      </td>
      <td className="px-3 py-2">
        <div className="h-4 w-24 skeleton" />
      </td>
      <td className="px-3 py-2">
        <div className="h-4 w-12 skeleton" />
      </td>
      <td className="px-3 py-2">
        <div className="h-4 w-10 skeleton" />
      </td>
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 h-4 w-24 skeleton" />
      <div className="h-6 w-16 skeleton" />
    </div>
  );
}