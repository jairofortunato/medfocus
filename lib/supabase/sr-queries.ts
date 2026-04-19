/**
 * Supabase queries for the Spaced Repetition system.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SRCard, ScheduledReview, StudyPlanConfig, SubtopicoWithHistory } from '../spaced-repetition';
import { addDays, getStudyDates } from '../spaced-repetition';
import { TAXONOMY } from '../config/taxonomy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>;

// ============================================================
// study_plan_config
// ============================================================

export async function fetchStudyPlanConfig(
  supabase: Client,
  userId: string,
): Promise<StudyPlanConfig | null> {
  const { data, error } = await supabase
    .from('study_plan_config')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as StudyPlanConfig | null;
}

export async function upsertStudyPlanConfig(
  supabase: Client,
  config: Omit<StudyPlanConfig, 'id'>,
): Promise<StudyPlanConfig> {
  const { data, error } = await supabase
    .from('study_plan_config')
    .upsert(config, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as StudyPlanConfig;
}

// ============================================================
// sr_cards
// ============================================================

export async function fetchSRCards(
  supabase: Client,
  userId: string,
): Promise<SRCard[]> {
  const { data, error } = await supabase
    .from('sr_cards')
    .select('*')
    .eq('user_id', userId)
    .order('next_review_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as SRCard[];
}

export async function fetchSRCard(
  supabase: Client,
  userId: string,
  area: string,
  subtopico: string,
): Promise<SRCard | null> {
  const { data, error } = await supabase
    .from('sr_cards')
    .select('*')
    .eq('user_id', userId)
    .eq('area', area)
    .eq('subtopico', subtopico)
    .maybeSingle();

  if (error) throw error;
  return data as SRCard | null;
}

export async function bulkInsertSRCards(
  supabase: Client,
  cards: Omit<SRCard, 'id' | 'created_at' | 'updated_at'>[],
): Promise<void> {
  if (cards.length === 0) return;

  const BATCH = 200;
  for (let i = 0; i < cards.length; i += BATCH) {
    const { error } = await supabase
      .from('sr_cards')
      .upsert(cards.slice(i, i + BATCH), { onConflict: 'user_id,area,subtopico' });
    if (error) throw error;
  }
}

export async function updateSRCard(
  supabase: Client,
  userId: string,
  area: string,
  subtopico: string,
  updates: Partial<Omit<SRCard, 'id' | 'user_id' | 'area' | 'subtopico'>>,
): Promise<void> {
  const { error } = await supabase
    .from('sr_cards')
    .update(updates)
    .eq('user_id', userId)
    .eq('area', area)
    .eq('subtopico', subtopico);

  if (error) throw error;
}

// ============================================================
// scheduled_reviews
// ============================================================

export async function fetchScheduledReviews(
  supabase: Client,
  userId: string,
  options?: { fromDate?: string; toDate?: string; status?: ScheduledReview['status'] },
): Promise<ScheduledReview[]> {
  let query = supabase
    .from('scheduled_reviews')
    .select('*')
    .eq('user_id', userId)
    .order('scheduled_date', { ascending: true });

  if (options?.fromDate) query = query.gte('scheduled_date', options.fromDate);
  if (options?.toDate) query = query.lte('scheduled_date', options.toDate);
  if (options?.status) query = query.eq('status', options.status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ScheduledReview[];
}

export async function fetchTodayReviews(
  supabase: Client,
  userId: string,
  todayStr: string,
): Promise<ScheduledReview[]> {
  const { data, error } = await supabase
    .from('scheduled_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('scheduled_date', todayStr)
    .eq('status', 'pending')
    .order('area', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ScheduledReview[];
}

/** Count pending reviews for today (for dashboard badge) */
export async function countTodayPendingReviews(
  supabase: Client,
  userId: string,
  todayStr: string,
): Promise<number> {
  const { count, error } = await supabase
    .from('scheduled_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('scheduled_date', todayStr)
    .eq('status', 'pending');

  if (error) throw error;
  return count ?? 0;
}

export async function bulkInsertScheduledReviews(
  supabase: Client,
  reviews: Omit<ScheduledReview, 'id' | 'created_at'>[],
): Promise<void> {
  if (reviews.length === 0) return;

  const BATCH = 200;
  for (let i = 0; i < reviews.length; i += BATCH) {
    const { error } = await supabase
      .from('scheduled_reviews')
      .upsert(reviews.slice(i, i + BATCH), {
        onConflict: 'user_id,area,subtopico,scheduled_date',
      });
    if (error) throw error;
  }
}

export async function completeScheduledReview(
  supabase: Client,
  userId: string,
  area: string,
  subtopico: string,
  scheduledDate: string,
  performancePct: number,
): Promise<void> {
  const { error } = await supabase
    .from('scheduled_reviews')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      performance_pct: performancePct,
    })
    .eq('user_id', userId)
    .eq('area', area)
    .eq('subtopico', subtopico)
    .eq('scheduled_date', scheduledDate);

  if (error) throw error;
}

export async function markMissedReviews(
  supabase: Client,
  userId: string,
  beforeDate: string,
): Promise<void> {
  const { error } = await supabase
    .from('scheduled_reviews')
    .update({ status: 'missed' })
    .eq('user_id', userId)
    .eq('status', 'pending')
    .lt('scheduled_date', beforeDate);

  if (error) throw error;
}

// ============================================================
// History: calculate per-subtopic performance from user_answers
// ============================================================

/**
 * Returns per-subtopic performance for the user across all exams.
 * Uses the questions.topicos JSONB column.
 */
export async function fetchSubtopicoPerformance(
  supabase: Client,
  userId: string,
): Promise<SubtopicoWithHistory[]> {
  // Get all questions with their topicos
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id, topicos')
    .not('topicos', 'is', null);

  if (qErr) throw qErr;

  const qList = (questions ?? []) as { id: string; topicos: { area: string; subtopico: string }[] }[];

  if (qList.length === 0) return buildAllSubtopicosList(null);

  // Fetch all user answers (no ID filter to avoid URL length limits)
  const { data: answers, error: aErr } = await supabase
    .from('user_answers')
    .select('question_id, is_correct')
    .eq('user_id', userId);

  if (aErr) throw aErr;

  const answerMap = new Map<string, boolean>();
  for (const a of answers ?? []) {
    answerMap.set(a.question_id, a.is_correct);
  }

  // Aggregate per (area, subtopico): performance stats + question count in bank
  const stats: Record<string, { total: number; correct: number }> = {};
  const questionCounts: Record<string, number> = {};

  for (const q of qList) {
    const topicos = Array.isArray(q.topicos) ? q.topicos : [];
    for (const t of topicos) {
      if (!t.area || !t.subtopico) continue;
      const key = `${t.area}|||${t.subtopico}`;

      // Count total questions in bank for this subtopico
      questionCounts[key] = (questionCounts[key] ?? 0) + 1;

      if (!stats[key]) stats[key] = { total: 0, correct: 0 };
      if (answerMap.has(q.id)) {
        stats[key].total++;
        if (answerMap.get(q.id)) stats[key].correct++;
      }
    }
  }

  // Build the full list from TAXONOMY, filling in performance and question counts
  return buildAllSubtopicosList(stats, questionCounts);
}

function buildAllSubtopicosList(
  stats: Record<string, { total: number; correct: number }> | null,
  questionCounts: Record<string, number> = {},
): SubtopicoWithHistory[] {
  const result: SubtopicoWithHistory[] = [];

  for (const area of TAXONOMY) {
    for (const sub of area.subtopicos) {
      const key = `${area.name}|||${sub.name}`;
      const s = stats?.[key];

      // Only include performance if user answered at least 5 questions
      const performancePct =
        s && s.total >= 5 ? Math.round((s.correct / s.total) * 100) : null;

      result.push({
        area: area.name,
        subtopico: sub.name,
        performancePct,
        questionCount: questionCounts[key] ?? 0,
      });
    }
  }

  return result;
}

// ============================================================
// Smart scheduling with displacement
// ============================================================

/**
 * Inserts a new review on the target date.
 * If that day is already at capacity (subjects_per_day), displaces the
 * least-urgent pending review from that day to the next available slot.
 */
export async function insertReviewWithDisplacement(
  supabase: Client,
  newReview: Omit<ScheduledReview, 'id' | 'created_at'>,
  config: Pick<StudyPlanConfig, 'days_of_week' | 'subjects_per_day'>,
): Promise<void> {
  const targetDate = newReview.scheduled_date;

  // Count pending reviews on target date
  const { count } = await supabase
    .from('scheduled_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', newReview.user_id)
    .eq('scheduled_date', targetDate)
    .eq('status', 'pending');

  const currentCount = count ?? 0;

  if (currentCount < config.subjects_per_day) {
    // Space available — just upsert
    await supabase
      .from('scheduled_reviews')
      .upsert(newReview, { onConflict: 'user_id,area,subtopico,scheduled_date' });
    return;
  }

  // Day is full — find least urgent item (longest interval_days = has been going best)
  const { data: dayReviews } = await supabase
    .from('scheduled_reviews')
    .select('id, area, subtopico')
    .eq('user_id', newReview.user_id)
    .eq('scheduled_date', targetDate)
    .eq('status', 'pending');

  if (!dayReviews || dayReviews.length === 0) {
    await supabase
      .from('scheduled_reviews')
      .upsert(newReview, { onConflict: 'user_id,area,subtopico,scheduled_date' });
    return;
  }

  // Fetch intervals for all items on that day
  const { data: cards } = await supabase
    .from('sr_cards')
    .select('area, subtopico, interval_days')
    .eq('user_id', newReview.user_id)
    .in('subtopico', dayReviews.map((r) => r.subtopico));

  // Pick the one with the highest interval (least urgent)
  let displaced = dayReviews[0];
  let maxInterval = 0;
  for (const r of dayReviews) {
    const card = cards?.find((c) => c.area === r.area && c.subtopico === r.subtopico);
    if ((card?.interval_days ?? 0) > maxInterval) {
      maxInterval = card?.interval_days ?? 0;
      displaced = r;
    }
  }

  // Find next study date after targetDate that has space (scan up to 60 days)
  const futureDates = getStudyDates(addDays(targetDate, 1), config.days_of_week, 60);
  let nextSlot: string | null = null;

  for (const d of futureDates) {
    const { count: c } = await supabase
      .from('scheduled_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', newReview.user_id)
      .eq('scheduled_date', d)
      .eq('status', 'pending');
    if ((c ?? 0) < config.subjects_per_day) {
      nextSlot = d;
      break;
    }
  }

  if (!nextSlot) {
    // No slot found — just append to target date
    await supabase
      .from('scheduled_reviews')
      .upsert(newReview, { onConflict: 'user_id,area,subtopico,scheduled_date' });
    return;
  }

  // Delete displaced from target date and re-insert on nextSlot
  await supabase
    .from('scheduled_reviews')
    .delete()
    .eq('id', displaced.id);

  await supabase
    .from('scheduled_reviews')
    .upsert(
      {
        user_id: newReview.user_id,
        area: displaced.area,
        subtopico: displaced.subtopico,
        scheduled_date: nextSlot,
        status: 'pending',
      },
      { onConflict: 'user_id,area,subtopico,scheduled_date' },
    );

  // Insert the new review on the original target date
  await supabase
    .from('scheduled_reviews')
    .upsert(newReview, { onConflict: 'user_id,area,subtopico,scheduled_date' });
}

// ============================================================
// Full plan creation (combines all steps)
// ============================================================

export async function deletePlan(
  supabase: Client,
  userId: string,
): Promise<void> {
  await Promise.all([
    supabase.from('scheduled_reviews').delete().eq('user_id', userId),
    supabase.from('sr_cards').delete().eq('user_id', userId),
    supabase.from('study_plan_config').delete().eq('user_id', userId),
  ]);
}
