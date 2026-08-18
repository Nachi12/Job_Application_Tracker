import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { JobApplication, JobStatus } from '../types/models';
import { jobsService, JobsResponse, JobFilters } from '../services/jobsService';
import { useToastContext } from './ToastContext';

interface JobsContextValue {
  jobs: JobApplication[];
  total: number;
  loading: boolean;
  filters: JobFilters;
  setFilters: (f: Partial<JobFilters>) => void;
  refresh: () => Promise<void>;
  create: (job: Partial<JobApplication>) => Promise<void>;
  update: (id: string, job: Partial<JobApplication>) => Promise<void>;
  updateStatusOptimistic: (id: string, newStatus: JobStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const JobsContext = createContext<JobsContextValue | undefined>(undefined);

const defaultFilters: JobFilters = {
  page: 1,
  pageSize: 50,
  sortBy: 'appliedDate',
  sortDir: 'desc'
};

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFiltersState] = useState<JobFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToastContext();

  const load = async (f: JobFilters = filters) => {
    setLoading(true);
    try {
      const res: JobsResponse = await jobsService.list(f);
      setJobs(res.data);
      setTotal(res.total);
    } catch (e) {
      pushToast('error', 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.pageSize, filters.sortBy, filters.sortDir, filters.status, filters.search]);

  const setFilters = (patch: Partial<JobFilters>) => {
    setFiltersState((prev) => ({ ...prev, page: 1, ...patch }));
  };

  const refresh = async () => load();

  const create = async (data: Partial<JobApplication>) => {
    try {
      const newJob = await jobsService.create(data);
      setJobs((prev) => [newJob, ...prev]);
      setTotal((prev) => prev + 1);
      pushToast('success', 'Application added successfully');
    } catch (e: any) {
      pushToast('error', e.response?.data?.error || 'Failed to create application');
    }
  };

  const update = async (id: string, data: Partial<JobApplication>) => {
    try {
      const updated = await jobsService.update(id, data);
      setJobs((prev) => prev.map((j) => (j._id === id || j.id === id ? updated : j)));
      pushToast('success', 'Application updated');
    } catch (e: any) {
      pushToast('error', 'Failed to update application');
    }
  };

  const updateStatusOptimistic = async (id: string, newStatus: JobStatus) => {
    // 1. Snapshot previous state for rollback
    const previousJobs = [...jobs];

    // 2. Optimistically update local state
    setJobs((prev) =>
      prev.map((j) => {
        const jobId = j._id || j.id;
        if (jobId === id) {
          return { ...j, status: newStatus };
        }
        return j;
      })
    );

    // 3. Perform network mutation
    try {
      await jobsService.update(id, { status: newStatus });
      pushToast('success', `Moved to ${newStatus}`);
    } catch (e) {
      // 4. Rollback on failure
      setJobs(previousJobs);
      pushToast('error', 'Failed to update status. Changes rolled back.');
    }
  };

  const remove = async (id: string) => {
    try {
      await jobsService.remove(id);
      setJobs((prev) => prev.filter((j) => j._id !== id && j.id !== id));
      setTotal((prev) => prev - 1);
      pushToast('success', 'Application deleted');
    } catch (e) {
      pushToast('error', 'Failed to delete application');
    }
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        total,
        loading,
        filters,
        setFilters,
        refresh,
        create,
        update,
        updateStatusOptimistic,
        remove
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobsContext() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobsContext must be used inside JobsProvider');
  return ctx;
}