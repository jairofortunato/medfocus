'use client';

import { useExamStore } from '@/lib/exam-store';
import StatItem from './StatItem';

export default function StatisticsTable() {
  const getTagStatistics = useExamStore((state) => state.getTagStatistics);
  const statistics = getTagStatistics();

  return (
    <div className="bg-white/50 rounded-2xl p-4 mt-2.5">
      {/* Header */}
      <div className="stats-grid stat-header">
        <div>Especialidade</div>
        <div className="text-center">Total</div>
        <div className="text-center">Respondidas</div>
        <div className="text-center">Acertos</div>
      </div>

      {/* Stats List */}
      <div className="max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
        {statistics.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Responda algumas questões para ver suas estatísticas
          </div>
        ) : (
          <div className="stats-grid">
            {statistics.map((stat) => (
              <StatItem key={stat.tag} stat={stat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
