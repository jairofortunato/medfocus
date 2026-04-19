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

/** Fetch images for a set of question IDs (separate query, much faster) */
async function fetchImagesForQuestions(
  supabase: Client,
  questionIds: string[]
): Promise<Record<string, any[]>> {
  if (questionIds.length === 0) return {};
  const { data } = await supabase
    .from('question_images')
    .select('*')
    .in('question_id', questionIds)
    .order('display_order', { ascending: true });

  const map: Record<string, any[]> = {};
  (data ?? []).forEach((img: any) => {
    if (!map[img.question_id]) map[img.question_id] = [];
    map[img.question_id].push(img);
  });
  return map;
}

/** Attach images to questions array */
function attachImages(
  questions: any[],
  imageMap: Record<string, any[]>
): any[] {
  return questions.map((q) => ({
    ...q,
    question_images: imageMap[q.id] ?? [],
  }));
}

export async function fetchQuestionsByArea(
  supabase: Client,
  areas: string[]
): Promise<(DbQuestion & { tags: string[]; exams: { nome: string; ano: number } })[]> {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*, exams(nome, ano)')
    .in('area', areas)
    .order('numero', { ascending: true });

  if (error) throw error;
  const qs = (questions ?? []) as any[];
  const imageMap = await fetchImagesForQuestions(supabase, qs.map((q) => q.id));
  return attachImages(qs, imageMap).map((q) => ({ ...q, tags: [], exams: q.exams }));
}

export async function fetchAllQuestions(
  supabase: Client
): Promise<(DbQuestion & { tags: string[]; exams: { nome: string; ano: number } })[]> {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*, exams(nome, ano)');

  if (error) throw error;
  const qs = (questions ?? []) as any[];
  const imageMap = await fetchImagesForQuestions(supabase, qs.map((q) => q.id));
  return attachImages(qs, imageMap).map((q) => ({ ...q, tags: [], exams: q.exams }));
}

export async function fetchAreaCounts(
  supabase: Client
): Promise<{ area: string; count: number }[]> {
  // Only fetch the area column (minimal data transfer)
  const { data, error } = await supabase
    .from('questions')
    .select('area')
    .not('area', 'is', null);

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data ?? []).forEach((q: any) => {
    counts[q.area] = (counts[q.area] || 0) + 1;
  });

  return Object.entries(counts).map(([area, count]) => ({ area, count }));
}

export async function fetchQuestionsForExam(
  supabase: Client,
  examId: string
): Promise<(DbQuestion & { tags: string[]; exams: { nome: string; ano: number } })[]> {
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*, exams(nome, ano)')
    .eq('exam_id', examId)
    .order('numero', { ascending: true });

  if (qError) throw qError;
  const qs = (questions ?? []) as any[];
  const imageMap = await fetchImagesForQuestions(supabase, qs.map((q) => q.id));
  return attachImages(qs, imageMap).map((q) => ({ ...q, tags: [], exams: q.exams }));
}

/**
 * Transform DB question rows into the frontend Question interface.
 * This maintains backward compatibility with existing components.
 */
export function transformToQuestionInterface(
  dbQuestions: (DbQuestion & { tags: string[]; exams?: { nome: string; ano: number } })[]
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
      ...(q.alternativa_e ? { E: q.alternativa_e } : {}),
    },
    resposta_correta: q.resposta_correta as 'A' | 'B' | 'C' | 'D' | 'E',
    area: q.area || undefined,
    explicacao: q.explicacao || '',
    images: (q.question_images ?? [])
      .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
        image_type: img.image_type,
        display_order: img.display_order,
        alt_text: img.alt_text,
      })),
    examNome: q.exams?.nome,
    examAno: q.exams?.ano,
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

/**
 * Fetch global (all exams) per-area stats for a user.
 * Groups by the `area` column on `questions` (21 medical areas).
 * Returns { area, total, answered, correct, percentage }[] sorted by percentage desc.
 */
export async function fetchGlobalAreaStatistics(
  supabase: Client,
  userId: string
): Promise<{ area: string; total: number; answered: number; correct: number; percentage: number }[]> {
  // 1. All questions grouped by area
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id, area')
    .not('area', 'is', null);

  if (qErr) throw qErr;

  // 2. All answers from this user
  const { data: answers, error: aErr } = await supabase
    .from('user_answers')
    .select('question_id, is_correct')
    .eq('user_id', userId);

  if (aErr) throw aErr;

  const answerMap = new Map<string, boolean>();
  (answers ?? []).forEach((a: any) => {
    answerMap.set(a.question_id, a.is_correct);
  });

  // 3. Aggregate per area
  const statsMap: Record<string, { total: number; answered: number; correct: number }> = {};

  (questions ?? []).forEach((q: any) => {
    const area = q.area as string;
    if (!statsMap[area]) statsMap[area] = { total: 0, answered: 0, correct: 0 };
    statsMap[area].total++;

    if (answerMap.has(q.id)) {
      statsMap[area].answered++;
      if (answerMap.get(q.id)) statsMap[area].correct++;
    }
  });

  return Object.entries(statsMap)
    .map(([area, s]) => ({
      area,
      total: s.total,
      answered: s.answered,
      correct: s.correct,
      percentage: s.answered > 0 ? (s.correct / s.answered) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

// ============================================================
// Topico queries (new 21-area taxonomy)
// ============================================================

/**
 * Fetch all (id, topicos) pairs and aggregate counts per area + subtopico.
 * Returns a map: { [area]: { total: number; subtopicos: { [subtopico]: number } } }
 */
export async function fetchTopicoCounts(
  supabase: Client
): Promise<Record<string, { total: number; subtopicos: Record<string, number> }>> {
  const { data, error } = await supabase
    .from('questions')
    .select('id, topicos')
    .not('topicos', 'is', null);

  if (error) throw error;

  const result: Record<string, { total: number; subtopicos: Record<string, number> }> = {};

  // Track question IDs per area to avoid double-counting the same question
  const areaQuestionSets: Record<string, Set<string>> = {};

  (data ?? []).forEach((row: any) => {
    const topicos: { area: string; subtopico: string }[] = row.topicos ?? [];
    topicos.forEach(({ area, subtopico }) => {
      if (!area) return;
      if (!result[area]) {
        result[area] = { total: 0, subtopicos: {} };
        areaQuestionSets[area] = new Set();
      }
      // Count unique questions per area
      if (!areaQuestionSets[area].has(row.id)) {
        areaQuestionSets[area].add(row.id);
        result[area].total++;
      }
      // Count per subtopico (each question counted once per subtopico)
      if (subtopico) {
        result[area].subtopicos[subtopico] = (result[area].subtopicos[subtopico] || 0) + 1;
      }
    });
  });

  return result;
}

/**
 * Fetch questions that belong to a given area (and optionally subtopico)
 * using the topicos JSONB column.
 */
export async function fetchQuestionsByTopico(
  supabase: Client,
  area: string,
  subtopico?: string
): Promise<(DbQuestion & { tags: string[]; exams: { nome: string; ano: number } })[]> {
  const filter = subtopico
    ? JSON.stringify([{ area, subtopico }])
    : JSON.stringify([{ area }]);

  const { data: questions, error } = await supabase
    .from('questions')
    .select('*, exams(nome, ano)')
    .filter('topicos', 'cs', filter)
    .order('numero', { ascending: true });

  if (error) throw error;
  const qs = (questions ?? []) as any[];
  const imageMap = await fetchImagesForQuestions(supabase, qs.map((q) => q.id));
  return attachImages(qs, imageMap).map((q) => ({ ...q, tags: [], exams: q.exams }));
}

export async function fetchStudyStreak(supabase: Client, userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_study_streak', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data as number;
}
