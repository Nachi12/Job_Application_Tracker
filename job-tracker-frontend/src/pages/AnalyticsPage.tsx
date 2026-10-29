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
      <div className="border-b border-[#D4AF83]/30 dark:border-white/10 pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#183451] dark:text-[#FAF7F2] tracking-tight">
          Pipeline Funnel & Analytics
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-normal mt-0.5">
          In-depth stage conversion rates, response metrics, and volume velocity over time.
        </p>
      </div>

      {/* Application Funnel Card */}
      {funnel.length > 0 && (
        <div className="quantus-card p-5 space-y-4">
          <h3 className="font-serif text-sm font-bold text-[#183451] dark:text-white">Conversion Funnel Stages</h3>
          <div className="grid gap-3 md:grid-cols-5">
            {funnel.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-[#D4AF83]/40 bg-[#FAF7F2]/80 p-3.5 dark:border-white/10 dark:bg-[#11253A]/60 text-center space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">{item.stage}</div>
                <div className="text-xl font-extrabold text-[#A9501C] dark:text-[#D4AF83]">{item.count}</div>
                <div className="text-[11px] font-medium text-stone-600 dark:text-stone-300">
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