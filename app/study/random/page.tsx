import { createClient } from '@/lib/supabase/server';
import { fetchAllQuestions, transformToQuestionInterface } from '@/lib/supabase/queries';
import { notFound } from 'next/navigation';
import ExamApp from '@/components/ExamApp';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Questões Aleatórias - Med Estudo Focado',
};

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function RandomStudyPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Fetch all questions from all exams
  const dbQuestions = await fetchAllQuestions(supabase);
  if (dbQuestions.length === 0) notFound();

  const questions = shuffle(transformToQuestionInterface(dbQuestions));

  // Fetch all user answers (single query, filter client-side)
  const { data: answerData } = await supabase
    .from('user_answers')
    .select('question_id, selected_answer')
    .eq('user_id', user.id);

  const answersMap: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'> = {};
  answerData?.forEach((a: any) => {
    answersMap[a.question_id] = a.selected_answer as 'A' | 'B' | 'C' | 'D' | 'E';
  });

  // Sort: unanswered first, already-answered at the end
  const sortedQuestions = [
    ...questions.filter((q) => !answersMap[q.id]),
    ...questions.filter((q) => !!answersMap[q.id]),
  ];

  return (
    <ExamApp
      questions={sortedQuestions}
      examId="random"
      examSlug="random"
      examNome="Questões Aleatórias"
      userId={user.id}
      initialAnswers={answersMap}
      initialQuestionIndex={0}
    />
  );
}
