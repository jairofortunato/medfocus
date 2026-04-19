'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  generateInitialSchedule,
  today,
} from '@/lib/spaced-repetition';
import {
  fetchSubtopicoPerformance,
  bulkInsertSRCards,
  bulkInsertScheduledReviews,
  upsertStudyPlanConfig,
  deletePlan,
} from '@/lib/supabase/sr-queries';

export async function createStudyPlan(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const daysRaw = formData.get('days_of_week') as string;
  const subjectsPerDay = parseInt(formData.get('subjects_per_day') as string, 10);
  const questionsPerDay = parseInt(formData.get('questions_per_day') as string, 10) || 30;
  const daysOfWeek: number[] = JSON.parse(daysRaw);

  if (!daysOfWeek.length || subjectsPerDay < 1) {
    throw new Error('Configuração inválida');
  }

  // Delete any existing plan
  await deletePlan(supabase, user.id);

  // Fetch performance history
  const subtopicos = await fetchSubtopicoPerformance(supabase, user.id);

  // Generate schedule
  const { cards, reviews } = generateInitialSchedule(
    user.id,
    subtopicos,
    { days_of_week: daysOfWeek, subjects_per_day: subjectsPerDay },
    today(),
  );

  // Persist
  await upsertStudyPlanConfig(supabase, {
    user_id: user.id,
    days_of_week: daysOfWeek,
    subjects_per_day: subjectsPerDay,
    questions_per_day: questionsPerDay,
  });
  await bulkInsertSRCards(supabase, cards);
  await bulkInsertScheduledReviews(supabase, reviews);

  redirect('/study/spaced');
}
