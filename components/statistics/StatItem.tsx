'use client';

import type { TagStatistic } from '@/lib/types';

interface StatItemProps {
  stat: TagStatistic;
}

export default function StatItem({ stat }: StatItemProps) {
  const getPercentageColor = () => {
    if (stat.answered === 0) return '';
    if (stat.percentage >= 70) return '';
    if (stat.percentage >= 50) return 'medium';
    return 'low';
  };

  const percentageClass = getPercentageColor();

  return (
    <>
      <div className="stat-cell font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {stat.tag}
      </div>
      <div className="stat-cell text-center">{stat.total}</div>
      <div className="stat-cell text-center">{stat.answered}</div>
      <div
        className={`stat-cell text-center font-semibold ${
          percentageClass === 'low'
            ? 'text-rose-500'
            : percentageClass === 'medium'
            ? 'text-amber-500'
            : 'text-emerald-500'
        }`}
      >
        {stat.answered > 0 ? `${stat.percentage.toFixed(1)}%` : '-'}
      </div>
    </>
  );
}
