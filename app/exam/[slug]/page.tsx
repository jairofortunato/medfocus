import { createClient } from '@/lib/supabase/server';
import { fetchExamBySlug, fetchQuestionsForExam, fetchUserAnswers, fetchUserProgress, transformToQuestionInterface } from '@/lib/supabase/queries';
import { notFound } from 'next/navigation';
import ExamApp from '@/components/ExamApp';

interface ExamPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ExamPageProps) {
  const supabase = createClient();
  try {
    const exam = await fetchExamBySlug(supabase, params.slug);
    return { title: `${exam.nome} - Med Estudo Focado` };
  } catch {
    return { title: 'Prova - Med Estudo Focado' };
  }
}

export default async function ExamPage({ params }: ExamPageProps) {
  const supabase = createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  // Fetch exam
  let exam;
  try {
    exam = await fetchExamBySlug(supabase, params.slug);
  } catch {
    notFound();
  }

  // Fetch questions with tags
  const dbQuestions = await fetchQuestionsForExam(supabase, exam.id);
  const questions = transformToQuestionInterface(dbQuestions);

  // Fetch user's existing answers
  const existingAnswers = await fetchUserAnswers(supabase, user.id, exam.id);
  const answersMap: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'> = {};
  existingAnswers?.forEach((a) => {
    answersMap[a.question_id] = a.selected_answer as 'A' | 'B' | 'C' | 'D' | 'E';
  });

  // Fetch user progress (current question position)
  const progress = await fetchUserProgress(supabase, user.id, exam.id);
  const startQuestion = progress?.current_question_numero
    ? progress.current_question_numero - 1 // Convert 1-based to 0-based
    : 0;

  return (
    <ExamApp
      questions={questions}
      examId={exam.id}
      examSlug={exam.slug}
      examNome={exam.nome}
      userId={user.id}
      initialAnswers={answersMap}
      initialQuestionIndex={startQuestion}
    />
  );
}
