/**
 * Sync explicacao field from data/exams/<slug>.json to Supabase.
 *
 * Usage:
 *   npx tsx scripts/sync-explicacoes.ts <slug>
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env.local') });

(async () => {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: npx tsx scripts/sync-explicacoes.ts <slug>');
    process.exit(1);
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const examPath = path.resolve(__dirname, `../data/exams/${slug}.json`);
  const data = JSON.parse(fs.readFileSync(examPath, 'utf-8'));

  const { data: exam, error: examErr } = await sb
    .from('exams')
    .select('id')
    .eq('slug', slug)
    .single();
  if (examErr || !exam) {
    console.error(`Exam not found: ${examErr?.message ?? slug}`);
    process.exit(1);
  }

  let updated = 0;
  let failed = 0;
  for (const q of data.questoes) {
    if (!q.explicacao) continue;
    const { error } = await sb
      .from('questions')
      .update({ explicacao: q.explicacao })
      .eq('exam_id', exam.id)
      .eq('numero', q.numero);
    if (error) {
      console.log(`✗ Q${q.numero}: ${error.message}`);
      failed++;
    } else {
      updated++;
    }
  }
  console.log(`✓ ${updated} explicações sincronizadas no Supabase (${failed} falhas)`);
})();
