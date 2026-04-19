import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env.local') });

(async () => {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Get first user
  const { data: users } = await sb.from('profiles').select('id').limit(1);
  const userId = users?.[0]?.id;
  if (!userId) { console.log('No users'); return; }

  console.log('Testing with user:', userId);

  // Test questions with area
  const { data: questions, error: qErr } = await sb
    .from('questions')
    .select('id, area')
    .not('area', 'is', null)
    .limit(5);
  console.log('Questions with area:', questions?.length, 'err:', qErr?.message);
  console.log('Sample:', questions?.slice(0, 2));

  // Test user_answers
  const { data: answers, error: aErr } = await sb
    .from('user_answers')
    .select('question_id, is_correct')
    .eq('user_id', userId)
    .limit(5);
  console.log('Answers:', answers?.length, 'err:', aErr?.message);

  // Full test
  const { fetchGlobalAreaStatistics } = await import('../lib/supabase/queries');
  const stats = await fetchGlobalAreaStatistics(sb, userId);
  console.log('Stats:', stats.length, 'areas');
  stats.forEach(s => console.log(`  ${s.area}: ${s.correct}/${s.answered} of ${s.total} (${s.percentage.toFixed(0)}%)`));
})();
