import { createClient } from '@/lib/supabase/server';
import { fetchExamBySlug } from '@/lib/supabase/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  try {
    const exam = await fetchExamBySlug(supabase, slug);
    return { title: `Estatísticas - ${exam.nome} - Med Estudo Focado` };
  } catch {
    return { title: 'Estatísticas - Med Estudo Focado' };
  }
}

const DARK_BLUE = '#0F3683';

export default async function ExamStatsPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  let exam;
  try {
    exam = await fetchExamBySlug(supabase, slug);
  } catch {
    notFound();
  }

  // Fetch questions with their tags
  const { data: questionsRaw } = await supabase
    .from('questions')
    .select('id, resposta_correta, question_tags(tags(nome))')
    .eq('exam_id', exam.id);

  const questions = questionsRaw ?? [];
  const questionIds = questions.map((q: any) => q.id);

  // Fetch user answers for this exam
  const { data: answersRaw } = await supabase
    .from('user_answers')
    .select('question_id, selected_answer, is_correct')
    .eq('user_id', user.id)
    .in('question_id', questionIds);

  const answersMap = new Map(
    (answersRaw ?? []).map((a: any) => [a.question_id, a])
  );

  // Compute per-tag statistics
  const tagStats: Record<string, { total: number; answered: number; correct: number }> = {};

  for (const q of questions as any[]) {
    const tagNames: string[] = (q.question_tags ?? [])
      .map((qt: any) => qt.tags?.nome)
      .filter(Boolean);

    const answer = answersMap.get(q.id);

    for (const tagName of tagNames) {
      if (!tagStats[tagName]) tagStats[tagName] = { total: 0, answered: 0, correct: 0 };
      tagStats[tagName].total++;
      if (answer) {
        tagStats[tagName].answered++;
        if ((answer as any).is_correct) tagStats[tagName].correct++;
      }
    }
  }

  const stats = Object.entries(tagStats)
    .map(([tag, s]) => ({
      tag,
      ...s,
      percentage: s.answered > 0 ? (s.correct / s.answered) * 100 : 0,
    }))
    .sort((a, b) => {
      // Answered first, sorted by %; unanswered at the bottom
      if (a.answered === 0 && b.answered > 0) return 1;
      if (b.answered === 0 && a.answered > 0) return -1;
      return b.percentage - a.percentage;
    });

  const totalQuestions = questions.length;
  const totalAnswered = answersMap.size;
  const totalCorrect = (answersRaw ?? []).filter((a: any) => a.is_correct).length;
  const overallPct = totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(0) : '0';

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 relative z-10">
      {/* Header */}
      <div className="glass-header px-5 py-5 mb-6">
        <Link
          href={`/exam/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold mb-4 transition-colors hover:opacity-80"
          style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
        >
          ← Voltar
        </Link>

        <h1
          className="text-2xl font-black mb-0.5"
          style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}
        >
          Estatísticas
        </h1>
        <p className="text-slate-400 text-sm">{exam.nome}</p>

        {/* Overall summary */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl px-4 py-3 text-center" style={{ backgroundColor: `${DARK_BLUE}08` }}>
            <div className="text-2xl font-black" style={{ color: DARK_BLUE, fontFamily: 'Nunito, sans-serif' }}>
              {totalAnswered}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">de {totalQuestions} respondidas</div>
          </div>
          <div className="rounded-xl px-4 py-3 text-center" style={{ backgroundColor: 'rgba(16,185,129,0.08)' }}>
            <div className="text-2xl font-black text-emerald-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {totalCorrect}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">acertos</div>
          </div>
          <div
            className="rounded-xl px-4 py-3 text-center"
            style={{
              backgroundColor:
                totalAnswered === 0
                  ? `${DARK_BLUE}08`
                  : Number(overallPct) >= 70
                  ? 'rgba(16,185,129,0.08)'
                  : Number(overallPct) >= 50
                  ? 'rgba(245,158,11,0.08)'
                  : 'rgba(244,63,94,0.08)',
            }}
          >
            <div
              className="text-2xl font-black"
              style={{
                fontFamily: 'Nunito, sans-serif',
                color:
                  totalAnswered === 0
                    ? DARK_BLUE
                    : Number(overallPct) >= 70
                    ? '#059669'
                    : Number(overallPct) >= 50
                    ? '#d97706'
                    : '#e11d48',
              }}
            >
              {overallPct}%
            </div>
            <div className="text-xs text-slate-500 mt-0.5">aproveitamento</div>
          </div>
        </div>
      </div>

      {/* Tag statistics table */}
      <div className="glass-card p-0 overflow-hidden">
        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_70px_70px_70px_70px] gap-2 px-5 py-3 border-b border-slate-200/60"
          style={{ backgroundColor: `${DARK_BLUE}06` }}
        >
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tópico</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide text-center">Total</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide text-center">Resp.</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide text-center">Acertos</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide text-center">%</span>
        </div>

        {/* Rows */}
        {stats.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Responda questões para ver suas estatísticas
          </div>
        ) : (
          stats.map((stat) => {
            const pctColor =
              stat.answered === 0
                ? 'text-slate-400'
                : stat.percentage >= 70
                ? 'text-emerald-600'
                : stat.percentage >= 50
                ? 'text-amber-500'
                : 'text-rose-500';

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
                className="grid grid-cols-[1fr_70px_70px_70px_70px] gap-2 px-5 py-3 border-b border-slate-100/80 last:border-b-0 hover:bg-white/40 transition-colors"
              >
                {/* Tag name + progress bar */}
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-sm font-medium text-slate-700 truncate">{stat.tag}</span>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1">
                    <div
                      className={`h-1.5 rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${stat.answered > 0 ? stat.percentage : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-500 text-center self-center">{stat.total}</span>
                <span className="text-sm text-slate-600 text-center self-center">
                  {stat.answered > 0 ? `${stat.answered}` : <span className="text-slate-300">—</span>}
                </span>
                <span className="text-sm text-slate-600 text-center self-center">
                  {stat.answered > 0 ? stat.correct : <span className="text-slate-300">—</span>}
                </span>
                <span className={`text-sm font-bold text-center self-center ${pctColor}`}>
                  {stat.answered > 0 ? `${stat.percentage.toFixed(0)}%` : '—'}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
