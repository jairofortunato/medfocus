'use client';

import Link from 'next/link';
import type { ScheduledReview } from '@/lib/spaced-repetition';
import { getResidencyColor, RESIDENCY_GROUPS } from '@/lib/spaced-repetition';
import { slugifyTopico } from '@/lib/config/taxonomy';

const DARK_BLUE = '#0F3683';

interface Props {
  reviews: ScheduledReview[];
  missedReviews?: ScheduledReview[];
}

function ReviewRow({ r, label, labelColor }: { r: ScheduledReview; label: string; labelColor: string }) {
  const areaSlug = slugifyTopico(r.area);
  const subSlug = slugifyTopico(r.subtopico);
  const color = getResidencyColor(r.area);
  const group = RESIDENCY_GROUPS[r.area] ?? r.area;

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/60 last:border-b-0 hover:bg-white/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-700 truncate">{r.subtopico}</p>
          <p className="text-xs text-slate-400">{group}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: labelColor }}
        >
          {label}
        </span>
        <Link
          href={`/study/spaced/session/${areaSlug}/${subSlug}`}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          Estudar
        </Link>
      </div>
    </div>
  );
}

export default function TodayReviews({ reviews, missedReviews = [] }: Props) {
  const pending = reviews.filter((r) => r.status === 'pending');
  const completed = reviews.filter((r) => r.status === 'completed');
  const hasMissed = missedReviews.length > 0;

  const totalExtra = missedReviews.length;

  if (reviews.length === 0 && !hasMissed) {
    return (
      <div className="glass-card px-6 py-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-slate-600">Nenhuma revisão para hoje!</p>
        <p className="text-sm text-slate-400 mt-1">Aproveite para revisar questões avulsas ou descansar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Today's reviews */}
      {reviews.length > 0 && (
        <div className="glass-card p-0 overflow-hidden">
          {/* Header */}
          <div
            className="px-5 py-4 border-b border-slate-100/80"
            style={{ backgroundColor: `${DARK_BLUE}06` }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
                Revisões de hoje
              </h2>
              <span className="text-sm font-bold" style={{ color: DARK_BLUE }}>
                {completed.length}/{reviews.length}
              </span>
            </div>
            <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full">
              <div
                className="h-1.5 rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: reviews.length > 0 ? `${(completed.length / reviews.length) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Pending today */}
          {pending.map((r) => (
            <ReviewRow key={`${r.area}|${r.subtopico}`} r={r} label="Hoje" labelColor={DARK_BLUE} />
          ))}

          {/* Completed today */}
          {completed.map((r) => {
            const pct = r.performance_pct;
            const pctColor =
              pct == null ? 'text-slate-400'
              : pct >= 75 ? 'text-emerald-600'
              : pct >= 50 ? 'text-amber-500'
              : 'text-rose-500';
            return (
              <div
                key={`${r.area}|${r.subtopico}|done`}
                className="flex items-center justify-between px-5 py-4 border-b border-slate-100/60 last:border-b-0 opacity-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xs">✓</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-600 truncate line-through">{r.subtopico}</p>
                    <p className="text-xs text-slate-400">{RESIDENCY_GROUPS[r.area] ?? r.area}</p>
                  </div>
                </div>
                {pct != null && (
                  <span className={`text-sm font-bold ${pctColor}`}>{pct}%</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Missed reviews */}
      {hasMissed && (
        <div className="glass-card p-0 overflow-hidden">
          <div
            className="px-5 py-4 border-b border-slate-100/80"
            style={{ backgroundColor: 'rgba(244,63,94,0.05)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-base text-rose-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Revisões em atraso
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {totalExtra} revisão{totalExtra > 1 ? 'ões' : ''} não concluída{totalExtra > 1 ? 's' : ''} — você pode fazê-las além das revisões do dia
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                style={{ backgroundColor: '#F43F5E' }}
              >
                {totalExtra}
              </div>
            </div>
          </div>

          {missedReviews.map((r) => (
            <ReviewRow key={`missed|${r.area}|${r.subtopico}|${r.scheduled_date}`} r={r} label="Atrasado" labelColor="#F43F5E" />
          ))}
        </div>
      )}
    </div>
  );
}
