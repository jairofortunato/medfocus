import { createClient } from '@/lib/supabase/server';
import { fetchQuestionsByTopico, transformToQuestionInterface } from '@/lib/supabase/queries';
import { getSubtopicoBySlug } from '@/lib/config/taxonomy';
import { notFound } from 'next/navigation';
import ExamApp from '@/components/ExamApp';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string; subtopico: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, subtopico } = await params;
  const found = getSubtopicoBySlug(slug, subtopico);
  const title = found
    ? `${found.subtopico.name} — ${found.area.name}`
    : 'Questões por Subtópico';
  return { title: `${title} - Med Estudo Focado` };
}

export default async function SubtopicoStudyPage({ params }: Props) {
  const { slug, subtopico: subSlug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const found = getSubtopicoBySlug(slug, subSlug);
  if (!found) notFound();

  const { area, subtopico } = found;

  // Fetch questions matching this area + subtopico via topicos JSONB
  const dbQuestions = await fetchQuestionsByTopico(
    supabase,
    area.name,
    subtopico.name
  );

  if (!dbQuestions || dbQuestions.length === 0) notFound();

  const questions = transformToQuestionInterface(dbQuestions);

  // Fetch user answers
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

  // Title shown in ExamApp: "Subtópico — Área"
  const examNome = `${subtopico.name} — ${area.name}`;

  return (
    <ExamApp
      questions={sortedQuestions}
      examId={`topico-${slug}-${subSlug}`}
      examSlug={`topico-${slug}-${subSlug}`}
      examNome={examNome}
      userId={user.id}
      initialAnswers={answersMap}
      initialQuestionIndex={0}
    />
  );
}
