import { useJobsContext } from '../context/JobsContext';
import KanbanBoard from '../components/KanbanBoard';
import { JobStatus } from '../types/models';

export default function KanbanPage() {
  const { jobs, updateStatusOptimistic } = useJobsContext();

  const handleStatusChange = async (id: string, status: JobStatus) => {
    await updateStatusOptimistic(id, status);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Application Kanban Pipeline
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Drag and drop cards across stages with instant optimistic updates and persistent sync.
        </p>
      </div>
      <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} />
    </div>
  );
}