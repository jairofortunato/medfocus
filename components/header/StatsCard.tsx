'use client';

import { useState } from 'react';
import { useExamStore } from '@/lib/exam-store';

export default function StatsCard() {
  const [isOpen, setIsOpen] = useState(false);
  const getTagStatistics = useExamStore((state) => state.getTagStatistics);
  const statistics = getTagStatistics();

  const answeredStats = statistics.filter((s) => s.answered > 0);
  const totalCorrect = answeredStats.reduce((sum, s) => sum + s.correct, 0);
  const totalAnswered = answeredStats.reduce((sum, s) => sum + s.answered, 0);
  const overallPct = totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(0) : '0';

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/80 hover:bg-white/80 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="font-semibold text-slate-700 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Estatísticas por Área
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {totalCorrect}/{totalAnswered} acertos ({overallPct}%)
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="mt-2 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/80 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_60px_60px_70px] gap-1 px-4 py-2 bg-slate-100/60 border-b border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Área</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide text-center">Resp.</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide text-center">Acertos</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide text-center">%</span>
          </div>

          {/* Scrollable rows */}
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
            {statistics.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs">
                Responda questões para ver estatísticas
              </div>
            ) : (
              statistics.map((stat) => {
                const pctColor =
                  stat.answered === 0
                    ? 'text-slate-400'
                    : stat.percentage >= 70
                    ? 'text-emerald-600'
                    : stat.percentage >= 50
                    ? 'text-amber-500'
                    : 'text-rose-500';

                const barWidth = stat.answered > 0 ? stat.percentage : 0;
                const barColor =
                  stat.answered === 0
                    ? 'bg-slate-200'
                    : stat.percentage >= 70
                    ? 'bg-emerald-400'
                    : stat.percentage >= 50
                    ? 'bg-amber-400'
                    : 'bg-rose-400';

                return (
                  <div
                    key={stat.tag}
                    className="grid grid-cols-[1fr_60px_60px_70px] gap-1 px-4 py-1.5 border-b border-slate-100/80 last:border-b-0 hover:bg-white/40 transition-colors"
                  >
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-xs font-medium text-slate-700 truncate">{stat.tag}</span>
                      <div className="w-full h-1 bg-slate-100 rounded-full mt-0.5">
                        <div
                          className={`h-1 rounded-full ${barColor} transition-all duration-500`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 text-center self-center">
                      {stat.answered}/{stat.total}
                    </span>
                    <span className="text-xs text-slate-600 text-center self-center">
                      {stat.correct}
                    </span>
                    <span className={`text-xs font-bold text-center self-center ${pctColor}`}>
                      {stat.answered > 0 ? `${stat.percentage.toFixed(0)}%` : '-'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
