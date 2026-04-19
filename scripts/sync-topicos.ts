/**
 * Syncs the `topicos` field from data/exams/*.json → Supabase questions.topicos
 *
 * Usage:
 *   npx tsx scripts/sync-topicos.ts [exam-slug]
 *   npx tsx scripts/sync-topicos.ts              # syncs all exams
 */

import 'dotenv/config';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const EXAMS_DIR = path.join(process.cwd(), 'data/exams');

async function syncExam(file: string) {
  const slug = path.basename(file, '.json');
  const examData = JSON.parse(fs.readFileSync(file, 'utf8'));

  // Get exam id from Supabase
  const { data: exam, error: examErr } = await supabase
    .from('exams')
    .select('id, nome')
    .eq('slug', slug)
    .single();

  if (examErr || !exam) {
    console.log(`  ⚠ Prova "${slug}" não encontrada no Supabase — pulando`);
    return 0;
  }

  // Get all questions for this exam (id + numero)
  const { data: dbQuestions, error: qErr } = await supabase
    .from('questions')
    .select('id, numero')
    .eq('exam_id', exam.id);

  if (qErr || !dbQuestions) {
    console.error(`  ✗ Erro ao buscar questões de ${slug}:`, qErr?.message);
    return 0;
  }

  const numeroToId = new Map<number, string>();
  dbQuestions.forEach((q: any) => numeroToId.set(q.numero, q.id));

  // Build updates
  const updates: { id: string; topicos: any[] }[] = [];
  for (const q of examData.questoes) {
    const dbId = numeroToId.get(q.numero);
    if (!dbId) continue;
    if (!q.topicos || q.topicos.length === 0) continue;
    updates.push({ id: dbId, topicos: q.topicos });
  }

  if (updates.length === 0) {
    console.log(`  ℹ ${slug}: nenhum tópico para sincronizar`);
    return 0;
  }

  // Update each question individually (UPDATE by id, only topicos field)
  let synced = 0;
  let failed = 0;
  for (const update of updates) {
    const { error } = await supabase
      .from('questions')
      .update({ topicos: update.topicos })
      .eq('id', update.id);
    if (error) {
      console.error(`  ✗ Q id=${update.id}:`, error.message);
      failed++;
    } else {
      synced++;
    }
  }
  if (failed > 0) console.warn(`  ⚠ ${failed} falhas`);

  console.log(`  ✓ ${slug}: ${synced}/${updates.length} questões com tópicos sincronizados`);
  return synced;
}

async function main() {
  const targetSlug = process.argv[2];
  const files = fs.readdirSync(EXAMS_DIR)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => !targetSlug || f === `${targetSlug}.json`)
    .map((f) => path.join(EXAMS_DIR, f));

  if (files.length === 0) {
    console.error('Nenhum arquivo encontrado.');
    process.exit(1);
  }

  console.log(`Sincronizando tópicos de ${files.length} prova(s)...\n`);
  let total = 0;
  for (const file of files) {
    total += await syncExam(file);
  }
  console.log(`\nTotal sincronizado: ${total} questões`);
}

main().catch(console.error);
