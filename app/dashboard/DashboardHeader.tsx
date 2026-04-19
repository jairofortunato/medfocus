'use client';

import { useState } from 'react';
import LogoutButton from './LogoutButton';

interface AreaStat {
  area: string;
  total: number;
  answered: number;
  correct: number;
  percentage: number;
}

interface Props {
  stats: AreaStat[];
}

const PINK = '#E292BE';
const LIGHT_BG = '#E1F5FF';
const NUNITO = 'Nunito, sans-serif';

export default function DashboardHeader({ stats }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const totalCorrect = stats.reduce((sum, s) => sum + s.correct, 0);
  const totalAnswered = stats.reduce((sum, s) => sum + s.answered, 0);
  const overallPct = totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(0) : '0';

  return (
    <div className="glass-header p-7 mb-6">
      {/* Top row: logo + actions */}
      <div className="flex items-center justify-between mb-1">
        <img src="/logo.png" alt="Med Focus" className="h-32" />

        <div className="flex flex-col items-end gap-2">
          {/* Stats toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:opacity-90 transition-all border-[3px]"
            style={{ backgroundColor: LIGHT_BG, fontFamily: NUNITO, borderColor: '#0F3683' }}
          >
            <span className="text-lg">📊</span>
            <span className="font-black text-sm" style={{ color: PINK }}>
              Estatísticas
            </span>
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Inline stats panel — expands header, pushes content down */}
      {isOpen && (
        <div
          className="mt-4 rounded-2xl overflow-hidden border-[3px]"
          style={{ backgroundColor: LIGHT_BG, borderColor: '#0F3683' }}
        >
          {/* Panel header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: `${PINK}20` }}>
            <h3 className="text-sm font-black" style={{ color: PINK, fontFamily: NUNITO }}>
              Estatísticas por Área
            </h3>
            <p className="text-[11px] mt-0.5 font-bold" style={{ color: PINK, fontFamily: NUNITO, opacity: 0.7 }}>
              {totalCorrect}/{totalAnswered} acertos ({overallPct}%) · {stats.length} áreas
            </p>
          </div>

          {/* Column headers */}
          <div
            className="grid grid-cols-[1fr_55px_55px_55px] gap-1 px-4 py-1.5"
            style={{ backgroundColor: `${PINK}10` }}
          >
            <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: PINK, fontFamily: NUNITO }}>Área</span>
            <span className="text-[10px] font-black uppercase tracking-wide text-center" style={{ color: PINK, fontFamily: NUNITO }}>Resp.</span>
            <span className="text-[10px] font-black uppercase tracking-wide text-center" style={{ color: PINK, fontFamily: NUNITO }}>Acertos</span>
            <span className="text-[10px] font-black uppercase tracking-wide text-center" style={{ color: PINK, fontFamily: NUNITO }}>%</span>
          </div>

          {/* Rows */}
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {stats.length === 0 ? (
              <div className="text-center py-6 text-xs" style={{ color: PINK, fontFamily: NUNITO, opacity: 0.6 }}>
                Responda questões para ver estatísticas
              </div>
            ) : (
              stats.map((stat) => (
                <div
                  key={stat.area}
                  className="grid grid-cols-[1fr_55px_55px_55px] gap-1 px-4 py-1.5 border-b last:border-b-0"
                  style={{ borderColor: `${PINK}10` }}
                >
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[11px] font-black truncate" style={{ color: PINK, fontFamily: NUNITO }}>
                      {stat.area}
                    </span>
                    <div className="w-full h-1.5 rounded-full mt-0.5" style={{ backgroundColor: `${PINK}20` }}>
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${stat.answered > 0 ? stat.percentage : 0}%`, backgroundColor: PINK }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-center self-center" style={{ color: PINK, fontFamily: NUNITO }}>
                    {stat.answered}/{stat.total}
                  </span>
                  <span className="text-[11px] font-bold text-center self-center" style={{ color: PINK, fontFamily: NUNITO }}>
                    {stat.correct}
                  </span>
                  <span className="text-[11px] font-black text-center self-center" style={{ color: PINK, fontFamily: NUNITO }}>
                    {stat.answered > 0 ? `${stat.percentage.toFixed(0)}%` : '-'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <p className="subtitle-text text-lg mt-4">
        Como deseja estudar?
      </p>
    </div>
  );
}
