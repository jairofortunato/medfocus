import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
config({ path: path.resolve(__dirname, '../.env.local') });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

(async () => {
  const { data: exam } = await sb.from('exams').select('id').eq('slug', 'revalida-inep-2022').single();
  const nums = process.argv.slice(2).map(Number);

  for (const n of nums) {
    const { data: q } = await sb.from('questions').select('id, numero, enunciado').eq('exam_id', exam!.id).eq('numero', n).single();
    if (q) {
      console.log(`\nQ${q.numero}: ${q.enunciado.substring(0, 120)}...`);
    } else {
      console.log(`\nQ${n}: NOT FOUND`);
    }
  }
})();
