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
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      <div className="border-b border-violet-100 dark:border-haiti-800 pb-4">
        <h1 className="text-xl font-bold text-haiti-900 dark:text-white tracking-tight">
          Application Funnel & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-haiti-300 font-normal mt-0.5">
          In-depth application conversion rates, response trends, and status distribution.
        </p>
      </div>

      {/* Application Funnel Card */}
      {funnel.length > 0 && (
        <div className="quantus-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-haiti-900 dark:text-white">Application Conversion Funnel</h3>
          <div className="grid gap-3 md:grid-cols-5">
            {funnel.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-violet-100 bg-violet-50/40 p-3.5 dark:border-haiti-800 dark:bg-haiti-950/60 text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-haiti-400">{item.stage}</div>
                <div className="text-xl font-extrabold text-violet-600 dark:text-violet-400">{item.count}</div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-haiti-300">
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