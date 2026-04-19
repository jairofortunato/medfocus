/**
 * Dump an exam from Supabase into data/exams/<slug>.json in the canonical format.
 *
 * Usage:
 *   npx tsx scripts/dump-exam.ts amrigs-2020
 *   npx tsx scripts/dump-exam.ts amrigs-2020 unifesp-2023
 *
 * Preserves any existing explanations in the target file if it already exists
 * (useful when the DB is older than the file).
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env.local') });

async function dumpExam(sb: any, slug: string) {
  // 1. Exam
  const { data: exam, error: examErr } = await sb
    .from('exams')
    .select('id, nome, total_questoes')
    .eq('slug', slug)
    .single();
  if (examErr || !exam) {
    console.error(`✗ ${slug}: ${examErr?.message ?? 'not found'}`);
    return;
  }

  // 2. Questions
  const { data: questions, error: qErr } = await sb
    .from('questions')
    .select('id, numero, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, resposta_correta, explicacao')
    .eq('exam_id', exam.id)
    .order('numero');
  if (qErr) {
    console.error(`✗ ${slug} questions: ${qErr.message}`);
    return;
  }

  // 3. Tags per question
  const qIds = questions.map((q: any) => q.id);
  const { data: qt, error: qtErr } = await sb
    .from('question_tags')
    .select('question_id, tags(nome)')
    .in('question_id', qIds);
  if (qtErr) {
    console.error(`✗ ${slug} tags: ${qtErr.message}`);
    return;
  }
  const tagsByQuestion: Record<string, string[]> = {};
  (qt ?? []).forEach((row: any) => {
    const tagName = row.tags?.nome;
    if (!tagName) return;
    (tagsByQuestion[row.question_id] ||= []).push(tagName);
  });

  // 4. Preserve hand-written explanations already in the JSON file
  const outPath = path.resolve(__dirname, `../data/exams/${slug}.json`);
  const preserved: Record<number, string> = {};
  if (fs.existsSync(outPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, 'utf-8'));
      (existing.questoes ?? []).forEach((q: any) => {
        if (q.explicacao) preserved[q.numero] = q.explicacao;
      });
    } catch {}
  }

  // 5. Shape canonical payload
  const payload = {
    prova: exam.nome,
    total_questoes: questions.length,
    questoes: questions.map((q: any) => {
      const alternativas: Record<string, string> = {
        A: q.alternativa_a,
        B: q.alternativa_b,
        C: q.alternativa_c,
        D: q.alternativa_d,
      };
      if (q.alternativa_e) alternativas.E = q.alternativa_e;
      return {
        numero: q.numero,
        tags: tagsByQuestion[q.id] ?? [],
        enunciado: q.enunciado,
        alternativas,
        resposta_correta: q.resposta_correta,
        explicacao: preserved[q.numero] ?? q.explicacao ?? null,
      };
    }),
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
  const withExpl = payload.questoes.filter((q) => q.explicacao).length;
  console.log(`✓ ${slug}: ${payload.questoes.length} questões (${withExpl} com explicação) → data/exams/${slug}.json`);
}

(async () => {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error('Usage: npx tsx scripts/dump-exam.ts <slug> [slug...]');
    process.exit(1);
  }
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
  for (const slug of slugs) {
    await dumpExam(sb, slug);
  }
})();
