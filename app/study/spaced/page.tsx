import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  fetchStudyPlanConfig,
  fetchScheduledReviews,
  fetchTodayReviews,
  markMissedReviews,
} from '@/lib/supabase/sr-queries';
import { today, addDays } from '@/lib/spaced-repetition';
import SpacedCalendar from '@/components/spaced/SpacedCalendar';
import TodayReviews from '@/components/spaced/TodayReviews';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Repetição Espaçada - Med Estudo Focado',
};

const DARK_BLUE = '#0F3683';

export default async function SpacedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const config = await fetchStudyPlanConfig(supabase, user.id);

  // No plan yet → redirect to setup
  if (!config) redirect('/study/spaced/setup');

  const todayStr = today();

  // Mark any pending reviews before today as missed
  await markMissedReviews(supabase, user.id, todayStr);

  // Fetch reviews for the current month + 1 month ahead (calendar)
  const monthStart = todayStr.slice(0, 8) + '01';
  const monthEnd = addDays(
    `${todayStr.slice(0, 4)}-${String(new Date(todayStr + 'T12:00:00Z').getUTCMonth() + 2).padStart(2, '0')}-01`,
    -1,
  );

  const [calendarReviews, todayReviews, missedReviews] = await Promise.all([
    fetchScheduledReviews(supabase, user.id, { fromDate: monthStart, toDate: monthEnd }),
    fetchTodayReviews(supabase, user.id, todayStr),
    fetchScheduledReviews(supabase, user.id, { status: 'missed' }),
  ]);

  const pendingToday = todayReviews.filter((r) => r.status === 'pending').length;
  const completedToday = todayReviews.filter((r) => r.status === 'completed').length;

  return (
    <div className="max-w-[700px] mx-auto px-6 py-8 relative z-10">
      {/* Header */}
      <div className="glass-header px-5 py-5 mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-bold mb-4 transition-colors hover:opacity-80"
          style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
        >
          ← Voltar
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-2xl font-black mb-0.5"
              style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
            >
              Repetição Espaçada
            </h1>
            <p className="text-slate-400 text-sm">
              {config.subjects_per_day} subtópico{config.subjects_per_day > 1 ? 's' : ''} por dia ·{' '}
              {config.days_of_week.length} dias por semana
            </p>
          </div>
          <Link
            href="/study/spaced/setup"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            ⚙️ Reconfigurar
          </Link>
        </div>

        {/* Today summary */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="rounded-xl px-3 py-3 text-center" style={{ backgroundColor: `${DARK_BLUE}08` }}>
            <div className="text-2xl font-black" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
              {todayReviews.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">hoje</div>
          </div>
          <div className="rounded-xl px-3 py-3 text-center" style={{ backgroundColor: 'rgba(16,185,129,0.08)' }}>
            <div className="text-2xl font-black text-emerald-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {completedToday}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">feitas</div>
          </div>
          <div
            className="rounded-xl px-3 py-3 text-center"
            style={{
              backgroundColor: pendingToday > 0 ? 'rgba(249,115,22,0.08)' : 'rgba(16,185,129,0.08)',
            }}
          >
            <div
              className="text-2xl font-black"
              style={{
                fontFamily: 'Nunito, sans-serif',
                color: pendingToday > 0 ? '#EA580C' : '#059669',
              }}
            >
              {pendingToday}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">pendentes</div>
          </div>
          <div
            className="rounded-xl px-3 py-3 text-center"
            style={{ backgroundColor: missedReviews.length > 0 ? 'rgba(244,63,94,0.08)' : `${DARK_BLUE}08` }}
          >
            <div
              className="text-2xl font-black"
              style={{
                fontFamily: 'Nunito, sans-serif',
                color: missedReviews.length > 0 ? '#E11D48' : DARK_BLUE,
              }}
            >
              {missedReviews.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">atrasadas</div>
          </div>
        </div>
      </div>

      {/* Today's reviews list */}
      <div className="mb-6">
        <TodayReviews reviews={todayReviews} missedReviews={missedReviews} />
      </div>

      {/* Calendar */}
      <SpacedCalendar reviews={calendarReviews} todayStr={todayStr} />
    </div>
  );
}
