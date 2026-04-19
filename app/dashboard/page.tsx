import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DashboardHeader from './DashboardHeader';
import { fetchGlobalAreaStatistics } from '@/lib/supabase/queries';
import { countTodayPendingReviews, fetchStudyPlanConfig } from '@/lib/supabase/sr-queries';
import { today } from '@/lib/spaced-repetition';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard - Med Estudo Focado',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch global per-area stats for the logged-in user
  let areaStats: Awaited<ReturnType<typeof fetchGlobalAreaStatistics>> = [];
  let pendingReviewsToday = 0;
  let hasPlan = false;
  try {
    if (user) {
      const [stats, pending, config] = await Promise.all([
        fetchGlobalAreaStatistics(supabase, user.id),
        countTodayPendingReviews(supabase, user.id, today()),
        fetchStudyPlanConfig(supabase, user.id),
      ]);
      areaStats = stats;
      pendingReviewsToday = pending;
      hasPlan = config !== null;
    }
  } catch (err) {
    // Non-blocking — dashboard still renders if stats fail
    console.error('Failed to fetch area stats:', err);
    areaStats = [];
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 relative z-10">
      <DashboardHeader stats={areaStats} />

      {/* Study Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Link
          href="/study/area"
          className="p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 sm:block sm:text-center rounded-2xl border-[3px] border-[#0F3683] backdrop-blur-sm"
          style={{ background: 'linear-gradient(135deg, rgba(225, 245, 255, 0.75), rgba(255, 255, 255, 0.85))' }}
        >
          <img src="/icons/medicina.png" alt="Por Área" className="w-12 h-12 sm:w-[72px] sm:h-[72px] sm:mx-auto sm:mb-3 flex-shrink-0" />
          <div>
            <h3 className="text-xl sm:text-3xl font-bold text-[#E292BE]" style={{ fontFamily: 'Nunito, sans-serif' }}>Por Área</h3>
            <p className="text-slate-400 text-xs mt-0.5 sm:mt-1">Escolha uma especialidade</p>
          </div>
        </Link>
        <Link
          href="/study/exam"
          className="p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 sm:block sm:text-center rounded-2xl border-[3px] border-[#0F3683] backdrop-blur-sm"
          style={{ background: 'linear-gradient(135deg, rgba(225, 245, 255, 0.75), rgba(255, 255, 255, 0.85))' }}
        >
          <img src="/icons/prova.png" alt="Por Prova" className="w-12 h-12 sm:w-[72px] sm:h-[72px] sm:mx-auto sm:mb-3 flex-shrink-0" />
          <div>
            <h3 className="text-xl sm:text-3xl font-bold text-[#E292BE]" style={{ fontFamily: 'Nunito, sans-serif' }}>Por Prova</h3>
            <p className="text-slate-400 text-xs mt-0.5 sm:mt-1">Prova completa</p>
          </div>
        </Link>
        <Link
          href="/study/random"
          className="p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 sm:block sm:text-center rounded-2xl border-[3px] border-[#0F3683] backdrop-blur-sm"
          style={{ background: 'linear-gradient(135deg, rgba(225, 245, 255, 0.75), rgba(255, 255, 255, 0.85))' }}
        >
          <img src="/icons/aleatorias.png" alt="Aleatórias" className="w-12 h-12 sm:w-[72px] sm:h-[72px] sm:mx-auto sm:mb-3 flex-shrink-0" />
          <div>
            <h3 className="text-xl sm:text-3xl font-bold text-[#E292BE]" style={{ fontFamily: 'Nunito, sans-serif' }}>Aleatórias</h3>
            <p className="text-slate-400 text-xs mt-0.5 sm:mt-1">Mistura de todas as provas</p>
          </div>
        </Link>
      </div>

      {/* Spaced Repetition card — full width */}
      <Link
        href={hasPlan ? '/study/spaced' : '/study/spaced/setup'}
        className="relative p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 rounded-2xl border-[3px] border-[#0F3683] backdrop-blur-sm overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(225, 245, 255, 0.75), rgba(255, 255, 255, 0.85))' }}
      >
        <div className="w-12 h-12 sm:w-[72px] sm:h-[72px] flex-shrink-0 flex items-center justify-center text-4xl sm:text-5xl">📅</div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-3xl font-bold text-[#E292BE]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Repetição Espaçada
          </h3>
          <p className="text-slate-400 text-xs mt-0.5 sm:mt-1">
            {hasPlan ? 'Plano personalizado ativo · revisões inteligentes' : 'Criar plano de estudos personalizado'}
          </p>
        </div>
        {hasPlan && pendingReviewsToday > 0 && (
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white"
            style={{ backgroundColor: '#E11D48' }}
          >
            {pendingReviewsToday}
          </div>
        )}
        {!hasPlan && (
          <div
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ backgroundColor: '#0F3683' }}
          >
            Configurar
          </div>
        )}
      </Link>
    </div>
  );
}
