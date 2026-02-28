/**
 * Seed script: imports data/questions.json into Supabase tables.
 *
 * Usage:
 *   npx tsx supabase/seed.ts
 *
 * Requires environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (service role, not anon key)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

interface JsonQuestion {
  numero: number;
  tags: string[];
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E: string };
  resposta_correta: string;
  explicacao: string;
}

interface JsonExamData {
  prova: string;
  total_questoes: number;
  questoes: JsonQuestion[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Load questions data
  const dataPath = path.join(__dirname, '..', 'data', 'questions.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const examData: JsonExamData = JSON.parse(raw);

  console.log(`Loaded ${examData.questoes.length} questions from ${examData.prova}`);

  // 1. Create exam
  const examSlug = slugify(examData.prova);
  const yearMatch = examData.prova.match(/\d{4}/);
  const ano = yearMatch ? parseInt(yearMatch[0]) : 2023;

  const { data: exam, error: examError } = await supabase
    .from('exams')
    .upsert(
      {
        slug: examSlug,
        nome: examData.prova,
        ano,
        total_questoes: examData.total_questoes,
        is_active: true,
      },
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (examError) {
    console.error('Error creating exam:', examError);
    process.exit(1);
  }
  console.log(`Exam created: ${exam.nome} (${exam.id})`);

  // 2. Collect and create unique tags
  const uniqueTags = new Set<string>();
  examData.questoes.forEach((q) => q.tags.forEach((t) => uniqueTags.add(t)));

  const tagRows = [...uniqueTags].map((nome) => ({
    nome,
    slug: slugify(nome),
  }));

  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .upsert(tagRows, { onConflict: 'nome' })
    .select();

  if (tagsError) {
    console.error('Error creating tags:', tagsError);
    process.exit(1);
  }
  console.log(`Tags created: ${tags.length}`);

  // Build tag lookup: nome -> id
  const tagLookup: Record<string, string> = {};
  tags.forEach((t) => {
    tagLookup[t.nome] = t.id;
  });

  // 3. Create questions
  const questionRows = examData.questoes.map((q) => ({
    exam_id: exam.id,
    numero: q.numero,
    enunciado: q.enunciado,
    alternativa_a: q.alternativas.A,
    alternativa_b: q.alternativas.B,
    alternativa_c: q.alternativas.C,
    alternativa_d: q.alternativas.D,
    alternativa_e: q.alternativas.E,
    resposta_correta: q.resposta_correta,
    explicacao: q.explicacao || null,
  }));

  // Insert in batches to avoid payload limits
  const BATCH_SIZE = 50;
  const insertedQuestions: any[] = [];

  for (let i = 0; i < questionRows.length; i += BATCH_SIZE) {
    const batch = questionRows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('questions')
      .upsert(batch, { onConflict: 'exam_id,numero' })
      .select();

    if (error) {
      console.error(`Error creating questions batch ${i}:`, error);
      process.exit(1);
    }
    insertedQuestions.push(...data);
  }
  console.log(`Questions created: ${insertedQuestions.length}`);

  // Build question lookup: numero -> id
  const questionLookup: Record<number, string> = {};
  insertedQuestions.forEach((q) => {
    questionLookup[q.numero] = q.id;
  });

  // 4. Create question_tags joins
  const questionTagRows: { question_id: string; tag_id: string }[] = [];
  examData.questoes.forEach((q) => {
    const questionId = questionLookup[q.numero];
    if (!questionId) return;
    q.tags.forEach((tagName) => {
      const tagId = tagLookup[tagName];
      if (!tagId) return;
      questionTagRows.push({ question_id: questionId, tag_id: tagId });
    });
  });

  // Delete existing question_tags for this exam's questions first
  const questionIdsForExam = insertedQuestions.map((q) => q.id);
  await supabase
    .from('question_tags')
    .delete()
    .in('question_id', questionIdsForExam);

  for (let i = 0; i < questionTagRows.length; i += BATCH_SIZE) {
    const batch = questionTagRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('question_tags').insert(batch);

    if (error) {
      console.error(`Error creating question_tags batch ${i}:`, error);
      process.exit(1);
    }
  }
  console.log(`Question-tag links created: ${questionTagRows.length}`);

  console.log('\nSeed completed successfully!');
  console.log(`  Exam: ${exam.nome} (slug: ${exam.slug})`);
  console.log(`  Tags: ${tags.length}`);
  console.log(`  Questions: ${insertedQuestions.length}`);
  console.log(`  Question-Tag links: ${questionTagRows.length}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
