interface Props {
  total: number;
  offers: number;
  rejections: number;
  interviews: number;
}

export default function StatsCards({ total, offers, rejections, interviews }: Props) {
  const cards = [
    { label: 'Total applications', value: total },
    { label: 'Interviews scheduled', value: interviews },
    { label: 'Offers received', value: offers },
    { label: 'Rejections', value: rejections }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {card.label}
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}