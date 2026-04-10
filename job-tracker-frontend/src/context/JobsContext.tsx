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
  remove: (id: string) => Promise<void>;
}

const JobsContext = createContext<JobsContextValue | undefined>(undefined);

const defaultFilters: JobFilters = {
  page: 1,
  pageSize: 10,
  sortBy: 'dateApplied',
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
    const res = await jobsService.create(data);

    console.log("CREATE RESPONSE:", res); // 🔥 DEBUG

    const newJob = res.job || res;

    setJobs((prev) => [newJob, ...prev]);
    setTotal((prev) => prev + 1);

    pushToast('success', 'Application added');
  } catch (e: any) {
    console.error("CREATE ERROR:", e.response?.data || e.message); // 🔥 IMPORTANT
    pushToast('error', e.response?.data?.error || 'Failed to create application');
  }
};

  const update = async (id: string, job: Partial<JobApplication>) => {
    await jobsService.update(id, job);
    pushToast('success', 'Application updated');
    await load();
  };

  const remove = async (id: string) => {
    await jobsService.remove(id);
    pushToast('success', 'Application deleted');
    await load();
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