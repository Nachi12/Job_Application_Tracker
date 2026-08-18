interface Props {
  total: number;
  offers: number;
  rejections: number;
  interviews: number;
}

export default function StatsCards({ total, offers, rejections, interviews }: Props) {
  const responseRate = total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0;

  const metrics = [
    { label: 'Applications', value: total, sub: 'Total tracked' },
    { label: 'Interviews', value: interviews, sub: 'Screening & active' },
    { label: 'Response Rate', value: `${responseRate}%`, sub: 'Interview conversion' },
    { label: 'Offers', value: offers, sub: 'Active offers' }
  ];

  return (
    <div className="quantus-card grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-violet-100 dark:divide-haiti-800">
      {metrics.map((m) => (
        <div key={m.label} className="p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-haiti-300 uppercase tracking-wider">
            {m.label}
          </div>
          <div className="text-2xl font-bold tracking-tight text-haiti-900 dark:text-white tabular-nums">
            {m.value}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-haiti-300">
            {m.sub}
          </div>
        </div>
      ))}
    </div>
  );
}