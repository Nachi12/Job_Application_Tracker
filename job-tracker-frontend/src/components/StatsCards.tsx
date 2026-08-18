import { Briefcase, CalendarCheck, Award, XCircle } from 'lucide-react';

interface Props {
  total: number;
  offers: number;
  rejections: number;
  interviews: number;
}

export default function StatsCards({ total, offers, rejections, interviews }: Props) {
  const cards = [
    { label: 'Total Applications', value: total, icon: Briefcase, color: 'text-violet-500 bg-violet-50 dark:bg-haiti-800' },
    { label: 'Interviews & Screens', value: interviews, icon: CalendarCheck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Offers Received', value: offers, icon: Award, color: 'text-haiti-900 bg-turbo-500 font-extrabold shadow-turbo-glow' },
    { label: 'Closed / Rejections', value: rejections, icon: XCircle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="quantus-card p-5 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-haiti-300">
                {card.label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="text-3xl font-extrabold tracking-tight text-haiti-900 dark:text-white tabular-nums">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}