import { useJobs } from '../hooks/useJobs';
import KanbanBoard from '../components/KanbanBoard';

export default function KanbanPage() {
  const { jobs, update } = useJobs();

  const handleStatusChange = async (id: string, status: any) => {
    await update(id, { status });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Kanban board</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Drag applications across stages as they progress.
        </p>
      </div>
      <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} />
    </div>
  );
}