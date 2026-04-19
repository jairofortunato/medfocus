import { createClient } from '@/lib/supabase/server';
import {
  fetchQuestionsByTopico,
  fetchQuestionsByArea,
  transformToQuestionInterface,
} from '@/lib/supabase/queries';
import { getAreaBySlug } from '@/lib/config/taxonomy';
import { areaFromSlug } from '@/lib/config/medical-areas';
import { notFound } from 'next/navigation';
import ExamApp from '@/components/ExamApp';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const area = getAreaBySlug(slug) ?? { name: areaFromSlug(slug) ?? slug };
  return { title: `${area.name} - Med Estudo Focado` };
}

export default async function AreaStudyPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Resolve area name — new taxonomy first, then legacy
  const taxonomyArea = getAreaBySlug(slug);
  const legacyAreaName = areaFromSlug(slug);
  if (!taxonomyArea && !legacyAreaName) notFound();

  let dbQuestions;

  if (taxonomyArea) {
    // New taxonomy: query by topicos JSONB
    dbQuestions = await fetchQuestionsByTopico(supabase, taxonomyArea.name);
  } else {
    // Legacy fallback: query by area column
    const { CLINICA_MEDICA_AREAS } = await import('@/lib/config/medical-areas');
    const areas = legacyAreaName === 'Clínica Médica'
      ? [...CLINICA_MEDICA_AREAS]
      : [legacyAreaName!];
    dbQuestions = await fetchQuestionsByArea(supabase, areas);
  }

  if (!dbQuestions || dbQuestions.length === 0) notFound();

  const questions = transformToQuestionInterface(dbQuestions);
  const areaName = taxonomyArea?.name ?? legacyAreaName!;

  // Fetch user answers for these questions
  const questionIdSet = new Set(questions.map((q) => q.id));
  const { data: answerData } = await supabase
    .from('user_answers')
    .select('question_id, selected_answer')
    .eq('user_id', user.id);

  const answersMap: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'> = {};
  answerData?.forEach((a: any) => {
    if (questionIdSet.has(a.question_id)) {
      answersMap[a.question_id] = a.selected_answer as 'A' | 'B' | 'C' | 'D' | 'E';
    }
  });

  // Unanswered first
  const sortedQuestions = [
    ...questions.filter((q) => !answersMap[q.id]),
    ...questions.filter((q) => !!answersMap[q.id]),
  ];

  return (
    <ExamApp
      questions={sortedQuestions}
      examId={`area-${slug}`}
      examSlug={`area-${slug}`}
      examNome={areaName}
      userId={user.id}
      initialAnswers={answersMap}
      initialQuestionIndex={0}
    />
  );
}
