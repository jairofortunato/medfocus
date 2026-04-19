'use client';

import { useMemo, useState } from 'react';
import type { ScheduledReview } from '@/lib/spaced-repetition';
import { getResidencyColor, RESIDENCY_GROUPS } from '@/lib/spaced-repetition';

const DARK_BLUE = '#0F3683';
const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface Props {
  reviews: ScheduledReview[];
  todayStr: string;
}

export default function SpacedCalendar({ reviews, todayStr }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date(todayStr + 'T12:00:00Z');
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();

  // Group reviews by date
  const byDate = useMemo(() => {
    const map: Record<string, ScheduledReview[]> = {};
    for (const r of reviews) {
      if (!map[r.scheduled_date]) map[r.scheduled_date] = [];
      map[r.scheduled_date].push(r);
    }
    return map;
  }, [reviews]);

  // Build calendar grid for current month
  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  const startDow = firstDay.getUTCDay();
  const daysInMonth = lastDay.getUTCDate();

  const cells: (number | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const selectedReviews = selectedDate ? (byDate[selectedDate] ?? []) : [];
  const selectedDayNum = selectedDate ? parseInt(selectedDate.split('-')[2]) : null;

  return (
    <div className="glass-card p-5">
      {/* Month header */}
      <div className="text-center mb-4">
        <span className="font-black text-lg" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
          {MONTHS[month]} {year}
        </span>
      </div>

      {/* Week day labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const ds = dateStr(day);
          const dayReviews = byDate[ds] ?? [];
          const isToday = ds === todayStr;
          const isPast = ds < todayStr;
          const isSelected = ds === selectedDate;
          const hasItems = dayReviews.length > 0;

          return (
            <button
              key={ds}
              onClick={() => setSelectedDate(isSelected ? null : ds)}
              className="flex flex-col items-center py-1.5 rounded-xl transition-all"
              style={{
                backgroundColor: isSelected
                  ? `${DARK_BLUE}18`
                  : isToday
                  ? `${DARK_BLUE}10`
                  : hasItems
                  ? 'rgba(0,0,0,0.02)'
                  : undefined,
                outline: isSelected ? `2px solid ${DARK_BLUE}40` : undefined,
              }}
            >
              {/* Day number — bigger */}
              <span
                className="text-base font-black w-8 h-8 flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: isToday ? DARK_BLUE : undefined,
                  color: isToday ? '#fff' : isPast ? '#CBD5E1' : '#1E293B',
                }}
              >
                {day}
              </span>

              {/* Dots */}
              {dayReviews.length > 0 && (
                <div className="flex flex-wrap justify-center gap-0.5 mt-0.5 max-w-[32px]">
                  {dayReviews.slice(0, 6).map((r, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          r.status === 'completed'
                            ? '#10B981'
                            : r.status === 'missed'
                            ? '#F43F5E'
                            : getResidencyColor(r.area),
                      }}
                    />
                  ))}
                  {dayReviews.length > 6 && (
                    <span className="text-[9px] text-slate-400">+{dayReviews.length - 6}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail panel */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-slate-200/60">
          <p className="text-sm font-black mb-3" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
            Dia {selectedDayNum} de {MONTHS[month]}
            {selectedReviews.length === 0 && (
              <span className="font-normal text-slate-400 ml-2 text-xs">Nenhuma revisão</span>
            )}
          </p>

          {selectedReviews.length > 0 && (
            <div className="flex flex-col gap-2">
              {selectedReviews.map((r, idx) => {
                const color = getResidencyColor(r.area);
                const group = RESIDENCY_GROUPS[r.area] ?? r.area;
                const statusColor =
                  r.status === 'completed' ? '#10B981'
                  : r.status === 'missed' ? '#F43F5E'
                  : color;
                const statusLabel =
                  r.status === 'completed' ? 'Concluído'
                  : r.status === 'missed' ? 'Perdido'
                  : 'Pendente';

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{r.subtopico}</p>
                      <p className="text-xs text-slate-400">{group}</p>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                      style={{ backgroundColor: statusColor }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
        {[
          { color: '#10B981', label: 'Concluído' },
          { color: '#F43F5E', label: 'Perdido' },
          { color: '#3B82F6', label: 'Pendente' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
        <span className="text-xs text-slate-300 ml-auto">Clique em um dia para ver os detalhes</span>
      </div>
    </div>
  );
}
