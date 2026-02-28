import type { SupabaseClient } from '@supabase/supabase-js';
import type { Exam, DbQuestion, UserAnswer, UserExamProgress, StudySession } from './types';
import type { Question } from '../types';

// Use any for generic to avoid complex type resolution issues with hand-written types.
// Return types are explicitly annotated on each function for safety.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

// ============================================================
// Exam queries
// ============================================================

export async function fetchExams(supabase: Client): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('is_active', true)
    .order('ano', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Exam[];
}

export async function fetchExamBySlug(supabase: Client, slug: string): Promise<Exam> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Exam;
}

// ============================================================
// Question queries
// ============================================================

export async function fetchQuestionsForExam(
  supabase: Client,
  examId: string
): Promise<(DbQuestion & { tags: string[] })[]> {
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', examId)
    .order('numero', { ascending: true });

  if (qError) throw qError;
  const dbQuestions = (questions ?? []) as DbQuestion[];

  // Fetch tags for all questions in one query
  const questionIds = dbQuestions.map((q) => q.id);
  if (questionIds.length === 0) return [];

  const { data: questionTags, error: qtError } = await supabase
    .from('question_tags')
    .select('question_id, tag_id')
    .in('question_id', questionIds);

  if (qtError) throw qtError;

  // Fetch all tags
  const tagIds = [...new Set((questionTags as any[])?.map((qt: any) => qt.tag_id) ?? [])];
  const { data: tags } = await supabase
    .from('tags')
    .select('id, nome')
    .in('id', tagIds);

  const tagNameMap: Record<string, string> = {};
  (tags as any[])?.forEach((t: any) => {
    tagNameMap[t.id] = t.nome;
  });

  // Build tag lookup: question_id -> tag names[]
  const tagMap: Record<string, string[]> = {};
  (questionTags as any[])?.forEach((qt: any) => {
    const qid = qt.question_id;
    const tagName = tagNameMap[qt.tag_id];
    if (!tagMap[qid]) tagMap[qid] = [];
    if (tagName) tagMap[qid].push(tagName);
  });

  return dbQuestions.map((q) => ({
    ...q,
    tags: tagMap[q.id] || [],
  }));
}

/**
 * Transform DB question rows into the frontend Question interface.
 * This maintains backward compatibility with existing components.
 */
export function transformToQuestionInterface(
  dbQuestions: (DbQuestion & { tags: string[] })[]
): Question[] {
  return dbQuestions.map((q) => ({
    id: q.id,
    numero: q.numero,
    tags: q.tags,
    enunciado: q.enunciado,
    alternativas: {
      A: q.alternativa_a,
      B: q.alternativa_b,
      C: q.alternativa_c,
      D: q.alternativa_d,
      E: q.alternativa_e,
    },
    resposta_correta: q.resposta_correta as 'A' | 'B' | 'C' | 'D' | 'E',
    explicacao: q.explicacao || '',
  }));
}

// ============================================================
// User answer queries
// ============================================================

export async function fetchUserAnswers(
  supabase: Client,
  userId: string,
  examId: string
): Promise<{ question_id: string; selected_answer: string; is_correct: boolean }[]> {
  const { data, error } = await supabase
    .from('user_answers')
    .select('question_id, selected_answer, is_correct')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []) as { question_id: string; selected_answer: string; is_correct: boolean }[];
}

export async function insertUserAnswer(
  supabase: Client,
  params: {
    userId: string;
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpentMs?: number;
    sessionId?: string;
  }
): Promise<UserAnswer> {
  const { data, error } = await supabase
    .from('user_answers')
    .insert({
      user_id: params.userId,
      question_id: params.questionId,
      selected_answer: params.selectedAnswer,
      is_correct: params.isCorrect,
      time_spent_ms: params.timeSpentMs ?? null,
      session_id: params.sessionId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserAnswer;
}

// ============================================================
// Progress queries
// ============================================================

export async function fetchUserProgress(
  supabase: Client,
  userId: string,
  examId: string
): Promise<UserExamProgress | null> {
  const { data, error } = await supabase
    .from('user_exam_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('exam_id', examId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return (data as UserExamProgress) ?? null;
}

export async function upsertUserProgress(
  supabase: Client,
  userId: string,
  examId: string,
  currentQuestionNumero: number
): Promise<void> {
  const { error } = await supabase
    .from('user_exam_progress')
    .upsert(
      {
        user_id: userId,
        exam_id: examId,
        current_question_numero: currentQuestionNumero,
        last_accessed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,exam_id' }
    );

  if (error) throw error;
}

// ============================================================
// Study session queries
// ============================================================

export async function createStudySession(
  supabase: Client,
  params: {
    userId: string;
    examId: string;
    sessionType?: string;
    plannedDurationSecs?: number;
  }
): Promise<StudySession> {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: params.userId,
      exam_id: params.examId,
      session_type: params.sessionType ?? 'pomodoro',
      planned_duration_secs: params.plannedDurationSecs ?? 1500,
    })
    .select()
    .single();

  if (error) throw error;
  return data as StudySession;
}

export async function endStudySession(
  supabase: Client,
  sessionId: string,
  params: {
    actualDurationSecs: number;
    questionsAnswered: number;
    questionsCorrect: number;
    completed: boolean;
  }
): Promise<void> {
  const { error } = await supabase
    .from('study_sessions')
    .update({
      ended_at: new Date().toISOString(),
      actual_duration_secs: params.actualDurationSecs,
      questions_answered: params.questionsAnswered,
      questions_correct: params.questionsCorrect,
      completed: params.completed,
    })
    .eq('id', sessionId);

  if (error) throw error;
}

// ============================================================
// Statistics queries
// ============================================================

export async function fetchTagStatistics(supabase: Client, userId: string, examId: string) {
  const { data, error } = await supabase.rpc('get_tag_statistics', {
    p_user_id: userId,
    p_exam_id: examId,
  });

  if (error) throw error;
  return data;
}

export async function fetchStudyStreak(supabase: Client, userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_study_streak', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data as number;
}
