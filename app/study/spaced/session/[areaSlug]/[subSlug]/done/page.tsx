import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSubtopicoBySlug } from '@/lib/config/taxonomy';
import { fetchQuestionsByTopico, transformToQuestionInterface } from '@/lib/supabase/queries';
import {
  fetchSRCard,
  fetchStudyPlanConfig,
} from '@/lib/supabase/sr-queries';
import {
  calculateNextInterval,
  processSessionResult,
  performanceLabel,
  today,
  RESIDENCY_GROUPS,
  getResidencyColor,
} from '@/lib/spaced-repetition';
import { completeReviewSession } from './actions';

export const dynamic = 'force-dynamic';

const DARK_BLUE = '#0F3683';

interface Props {
  params: Promise<{ areaSlug: string; subSlug: string }>;
  searchParams: Promise<{ quota?: string }>;
}

export default async function SpacedSessionDonePage({ params, searchParams }: Props) {
  const { areaSlug, subSlug } = await params;
  const { quota: quotaParam } = await searchParams;
  const quota = quotaParam ? parseInt(quotaParam, 10) : null;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const found = getSubtopicoBySlug(areaSlug, subSlug);
  if (!found) notFound();

  const { area, subtopico } = found;

  // Fetch questions for this subtopico
  const dbQuestions = await fetchQuestionsByTopico(supabase, area.name, subtopico.name);
  if (!dbQuestions || dbQuestions.length === 0) notFound();

  const questions = transformToQuestionInterface(dbQuestions);
  const questionIds = questions.map((q) => q.id);

  // Fetch user answers for these questions, sorted by most recent first
  // Limit to quota (session size) to measure only this session's performance
  let answerQuery = supabase
    .from('user_answers')
    .select('question_id, is_correct')
    .eq('user_id', user.id)
    .in('question_id', questionIds)
    .order('answered_at', { ascending: false });

  if (quota) answerQuery = answerQuery.limit(quota);

  const { data: answerData } = await answerQuery;

  const answered = (answerData ?? []).length;
  const correct = (answerData ?? []).filter((a: any) => a.is_correct).length;
  const performancePct = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  // Get SR card for this subtopico
  const [card, config] = await Promise.all([
    fetchSRCard(supabase, user.id, area.name, subtopico.name),
    fetchStudyPlanConfig(supabase, user.id),
  ]);

  // Calculate next interval preview
  const { intervalDays } = calculateNextInterval(
    performancePct,
    card?.excellent_streak ?? 0,
  );

  // Find scheduled_date for today's review (most recent pending/today)
  const todayStr = today();
  const { data: reviewData } = await supabase
    .from('scheduled_reviews')
    .select('scheduled_date')
    .eq('user_id', user.id)
    .eq('area', area.name)
    .eq('subtopico', subtopico.name)
    .eq('status', 'pending')
    .lte('scheduled_date', todayStr)
    .order('scheduled_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  const scheduledDate = reviewData?.scheduled_date ?? todayStr;

  const label = performanceLabel(performancePct);
  const accentColor = getResidencyColor(area.name);

  const performanceColor =
    performancePct >= 75
      ? '#059669'
      : performancePct >= 50
      ? '#d97706'
      : '#e11d48';

  const performanceBg =
    performancePct >= 75
      ? 'rgba(16,185,129,0.08)'
      : performancePct >= 50
      ? 'rgba(245,158,11,0.08)'
      : 'rgba(244,63,94,0.08)';

  return (
    <div className="max-w-[500px] mx-auto px-6 py-12 relative z-10">
      <div className="glass-card p-8 text-center">
        {/* Big score */}
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: performanceBg }}
        >
          <span
            className="text-4xl font-black"
            style={{ color: performanceColor, fontFamily: 'Nunito, sans-serif' }}
          >
            {performancePct}%
          </span>
        </div>

        <h1
          className="text-2xl font-black mb-1"
          style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
        >
          {label}!
        </h1>
        <p className="text-slate-400 text-sm mb-1">{subtopico.name}</p>
        <p className="text-xs text-slate-400 mb-6">{RESIDENCY_GROUPS[area.name] ?? area.name}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl py-3" style={{ backgroundColor: `${DARK_BLUE}08` }}>
            <div className="text-xl font-black" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
              {answered}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">respondidas</div>
          </div>
          <div className="rounded-xl py-3" style={{ backgroundColor: 'rgba(16,185,129,0.08)' }}>
            <div className="text-xl font-black text-emerald-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {correct}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">acertos</div>
          </div>
          <div className="rounded-xl py-3" style={{ backgroundColor: 'rgba(244,63,94,0.08)' }}>
            <div className="text-xl font-black text-rose-500" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {answered - correct}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">erros</div>
          </div>
        </div>

        {/* Next review */}
        <div
          className="rounded-xl px-4 py-4 mb-8"
          style={{ backgroundColor: `${accentColor}10`, border: `1.5px solid ${accentColor}30` }}
        >
          <p className="text-xs text-slate-500 mb-1">Próxima revisão</p>
          <p className="text-xl font-black" style={{ color: accentColor, fontFamily: 'Nunito, sans-serif' }}>
            Em {intervalDays} dias
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {intervalDays <= 7 ? 'Continue praticando' : intervalDays <= 21 ? 'Bom progresso!' : '🏆 Ótimo domínio!'}
          </p>
        </div>

        {/* Actions */}
        <form action={completeReviewSession}>
          <input type="hidden" name="area" value={area.name} />
          <input type="hidden" name="subtopico" value={subtopico.name} />
          <input type="hidden" name="performance_pct" value={performancePct} />
          <input type="hidden" name="scheduled_date" value={scheduledDate} />
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-black text-white mb-3 transition-opacity hover:opacity-90"
            style={{ backgroundColor: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
          >
            Concluir e agendar próxima revisão
          </button>
        </form>

        <Link
          href={`/study/spaced/session/${areaSlug}/${subSlug}`}
          className="block w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          ← Continuar estudando
        </Link>
      </div>
    </div>
  );
}
