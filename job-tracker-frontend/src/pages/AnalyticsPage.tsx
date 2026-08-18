import { useState, useEffect } from 'react';
import { useJobsContext } from '../context/JobsContext';
import apiClient from '../services/apiClient';
import ApplicationsOverTimeChart from '../components/charts/ApplicationsOverTimeChart';
import StatusDistributionChart from '../components/charts/StatusDistributionChart';

export default function AnalyticsPage() {
  const { jobs = [] } = useJobsContext();
  const [funnel, setFunnel] = useState<any[]>([]);

  useEffect(() => {
    const fetchFunnel = async () => {
      try {
        const res = await apiClient.get('/analytics/funnel');
        setFunnel(res.data.funnel || []);
      } catch (e) {
        console.error('Failed to fetch funnel data', e);
      }
    };
    fetchFunnel();
  }, []);

  const normalizedJobs = jobs.map((job) => ({
    ...job,
    company: job.companyName,
    dateApplied: job.appliedDate,
    status: job.status?.toUpperCase()
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Application Funnel & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          In-depth application conversion rates, response trends, and status distribution.
        </p>
      </div>

      {/* Application Funnel Card */}
      {funnel.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Application Conversion Funnel</h3>
          <div className="grid gap-3 md:grid-cols-5">
            {funnel.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-950 text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.stage}</div>
                <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{item.count}</div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                  {item.conversionRate}% conversion
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <ApplicationsOverTimeChart jobs={normalizedJobs as any} />
        <StatusDistributionChart jobs={normalizedJobs as any} />
      </div>
    </div>
  );
}