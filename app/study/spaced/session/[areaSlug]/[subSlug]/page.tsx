import { createClient } from '@/lib/supabase/server';
import { fetchQuestionsByTopico, transformToQuestionInterface } from '@/lib/supabase/queries';
import { getSubtopicoBySlug } from '@/lib/config/taxonomy';
import { fetchStudyPlanConfig } from '@/lib/supabase/sr-queries';
import { notFound } from 'next/navigation';
import ExamApp from '@/components/ExamApp';
import SpacedSessionWrapper from '@/components/spaced/SpacedSessionWrapper';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ areaSlug: string; subSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { areaSlug, subSlug } = await params;
  const found = getSubtopicoBySlug(areaSlug, subSlug);
  const title = found ? `${found.subtopico.name} — Revisão` : 'Sessão de Revisão';
  return { title: `${title} - Med Estudo Focado` };
}

export default async function SpacedSessionPage({ params }: Props) {
  const { areaSlug, subSlug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const found = getSubtopicoBySlug(areaSlug, subSlug);
  if (!found) notFound();

  const { area, subtopico } = found;

  const [dbQuestions, config] = await Promise.all([
    fetchQuestionsByTopico(supabase, area.name, subtopico.name),
    fetchStudyPlanConfig(supabase, user.id),
  ]);

  if (!dbQuestions || dbQuestions.length === 0) notFound();

  const allQuestions = transformToQuestionInterface(dbQuestions);
  const questionIds = allQuestions.map((q) => q.id);

  // Calculate per-session quota
  const questionsPerDay = config?.questions_per_day ?? 20;
  const subjectsPerDay = config?.subjects_per_day ?? 2;
  const quota = Math.max(1, Math.floor(questionsPerDay / subjectsPerDay));

  // Fetch user answers with timestamps for rotation
  const { data: answerData } = await supabase
    .from('user_answers')
    .select('question_id, selected_answer, answered_at')
    .eq('user_id', user.id)
    .in('question_id', questionIds)
    .order('answered_at', { ascending: true }); // oldest first

  const answersMap: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'> = {};
  const answeredAtMap: Record<string, string> = {};
  (answerData ?? []).forEach((a: any) => {
    answersMap[a.question_id] = a.selected_answer as 'A' | 'B' | 'C' | 'D' | 'E';
    answeredAtMap[a.question_id] = a.answered_at;
  });

  // 1. Unanswered questions (always prioritized, in DB order)
  const unanswered = allQuestions.filter((q) => !answersMap[q.id]);

  // 2. Already answered, sorted by oldest answered_at first (most stale = highest priority for review)
  const answered = allQuestions
    .filter((q) => !!answersMap[q.id])
    .sort((a, b) => {
      const tA = answeredAtMap[a.id] ?? '';
      const tB = answeredAtMap[b.id] ?? '';
      return tA.localeCompare(tB); // oldest first
    });

  // Build session list: unanswered first, then oldest-answered, capped at quota
  const sessionQuestions = [...unanswered, ...answered].slice(0, quota);

  // Only pass answers for questions IN this session
  const sessionIds = new Set(sessionQuestions.map((q) => q.id));
  const sessionAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'> = {};
  for (const id of sessionIds) {
    if (answersMap[id]) sessionAnswers[id] = answersMap[id];
  }

  const examNome = `${subtopico.name} — ${area.name}`;
  const doneHref = `/study/spaced/session/${areaSlug}/${subSlug}/done`;

  return (
    <SpacedSessionWrapper doneHref={doneHref} quota={quota}>
      <ExamApp
        questions={sessionQuestions}
        examId={`spaced-${areaSlug}-${subSlug}`}
        examSlug={`spaced-${areaSlug}-${subSlug}`}
        examNome={examNome}
        userId={user.id}
        initialAnswers={sessionAnswers}
        initialQuestionIndex={0}
      />
    </SpacedSessionWrapper>
  );
}
