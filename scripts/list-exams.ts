import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env.local') });

(async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await sb
    .from('exams')
    .select('id, slug, nome, ano, total_questoes, is_active')
    .order('nome');
  if (error) {
    console.error('ERR:', error.message);
    process.exit(1);
  }
  console.log(JSON.stringify(data, null, 2));
})();
