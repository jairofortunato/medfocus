'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { today, processSessionResult } from '@/lib/spaced-repetition';
import {
  fetchSRCard,
  updateSRCard,
  insertReviewWithDisplacement,
  completeScheduledReview,
  fetchStudyPlanConfig,
} from '@/lib/supabase/sr-queries';

export async function completeReviewSession(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const area = formData.get('area') as string;
  const subtopico = formData.get('subtopico') as string;
  const performancePct = parseFloat(formData.get('performance_pct') as string);
  const scheduledDate = formData.get('scheduled_date') as string;

  // Fetch card and config
  const [card, config] = await Promise.all([
    fetchSRCard(supabase, user.id, area, subtopico),
    fetchStudyPlanConfig(supabase, user.id),
  ]);

  if (!card || !config) redirect('/study/spaced');

  const todayStr = today();
  const { updatedCard, nextReview } = processSessionResult(
    card,
    performancePct,
    todayStr,
    config,
  );

  // Update card + complete today's review + schedule next (with displacement if day is full)
  await Promise.all([
    updateSRCard(supabase, user.id, area, subtopico, updatedCard),
    completeScheduledReview(supabase, user.id, area, subtopico, scheduledDate, performancePct),
  ]);
  await insertReviewWithDisplacement(supabase, nextReview, config);

  redirect('/study/spaced');
}
