import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env.local') });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

(async () => {
  const { data: exam } = await sb.from('exams').select('id').eq('slug', 'revalida-inep-2022').single();
  console.log('Exam:', exam?.id);

  const { data: q } = await sb.from('questions').select('id, numero').eq('exam_id', exam!.id).eq('numero', 1).single();
  console.log('Q1 id:', q?.id);

  const { data: imgs, error } = await sb.from('question_images').select('*').eq('question_id', q!.id);
  console.log('Images:', imgs?.length ?? 0, error?.message ?? '');
  imgs?.forEach((i: any) => console.log('  url:', i.image_url, 'type:', i.image_type));

  // Also check total question_images
  const { count } = await sb.from('question_images').select('*', { count: 'exact', head: true });
  console.log('Total question_images rows:', count);
})();
