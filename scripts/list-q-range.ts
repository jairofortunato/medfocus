import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env.local') });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
(async () => {
  const { data: exam } = await sb.from('exams').select('id').eq('slug', 'revalida-inep-2022').single();
  const { data: qs } = await sb.from('questions').select('numero, enunciado').eq('exam_id', exam!.id).order('numero').gte('numero', 95);
  qs?.forEach(q => console.log(`Q${q.numero}: ${q.enunciado.substring(0, 80)}...`));
})();
