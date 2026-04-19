/**
 * Seed script: imports exam JSON files into Supabase tables.
 *
 * Usage:
 *   npx tsx supabase/seed.ts                          # imports all JSONs in data/exams/
 *   npx tsx supabase/seed.ts data/exams/ufsc-2022.json  # import specific file
 *
 * All exam JSONs live in `data/exams/` and follow the format defined in
 * `docs/EXAM_JSON_FORMAT.md` (see CLAUDE.md). Explanations are authored
 * manually in-conversation, not generated via API.
 *
 * Requires environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (service role, not anon key)
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
config({ path: path.resolve(__dirname, '..', '.env.local') });

interface JsonQuestion {
  numero: number;
  tags: string[];
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E?: string };
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

const BATCH_SIZE = 50;

async function seedExam(supabase: any, filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const examData: JsonExamData = JSON.parse(raw);

  console.log(`\n=== ${examData.prova} (${examData.questoes.length} questions) ===`);

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
    return;
  }
  console.log(`Exam: ${exam.nome} (${exam.id})`);

  // 2. Collect and create unique tags
  const uniqueTags = new Set<string>();
  examData.questoes.forEach((q) => q.tags.forEach((t) => uniqueTags.add(t)));

  const tagRows = [...uniqueTags].map((nome) => ({
    nome,
    slug: slugify(nome),
  }));

  // Insert tags in smaller batches to avoid unique constraint errors on slug
  const allTags: any[] = [];
  for (let i = 0; i < tagRows.length; i += BATCH_SIZE) {
    const batch = tagRows.slice(i, i + BATCH_SIZE);
    const { data, error: tagsError } = await supabase
      .from('tags')
      .upsert(batch, { onConflict: 'nome', ignoreDuplicates: true })
      .select();

    if (tagsError) {
      // Fallback: fetch existing tags individually if upsert fails (slug conflict)
      for (const row of batch) {
        const { data: existing } = await supabase
          .from('tags')
          .select()
          .eq('nome', row.nome)
          .maybeSingle();
        if (existing) allTags.push(existing);
        else {
          const { data: created } = await supabase
            .from('tags')
            .upsert(row, { onConflict: 'nome', ignoreDuplicates: true })
            .select()
            .maybeSingle();
          if (created) allTags.push(created);
        }
      }
    } else {
      allTags.push(...(data ?? []));
    }
  }

  // Also fetch any tags that might already exist but weren't returned by upsert
  const { data: existingTags } = await supabase
    .from('tags')
    .select()
    .in('nome', [...uniqueTags]);
  const tags = existingTags ?? allTags;
  console.log(`Tags: ${tags.length}`);

  const tagLookup: Record<string, string> = {};
  tags.forEach((t: any) => {
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
    alternativa_e: q.alternativas.E || null,
    resposta_correta: q.resposta_correta,
    explicacao: q.explicacao || null,
  }));

  const insertedQuestions: any[] = [];

  for (let i = 0; i < questionRows.length; i += BATCH_SIZE) {
    const batch = questionRows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('questions')
      .upsert(batch, { onConflict: 'exam_id,numero' })
      .select();

    if (error) {
      console.error(`Error creating questions batch ${i}:`, error);
      return;
    }
    insertedQuestions.push(...data);
  }
  console.log(`Questions: ${insertedQuestions.length}`);

  // Build question lookup: numero -> id
  const questionLookup: Record<number, string> = {};
  insertedQuestions.forEach((q: any) => {
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
  const questionIdsForExam = insertedQuestions.map((q: any) => q.id);
  await supabase
    .from('question_tags')
    .delete()
    .in('question_id', questionIdsForExam);

  for (let i = 0; i < questionTagRows.length; i += BATCH_SIZE) {
    const batch = questionTagRows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('question_tags').insert(batch);

    if (error) {
      console.error(`Error creating question_tags batch ${i}:`, error);
      return;
    }
  }
  console.log(`Question-tag links: ${questionTagRows.length}`);
  console.log(`Done: ${exam.nome}`);
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

  // Determine which files to import
  const args = process.argv.slice(2);
  const examsDir = path.resolve('data/exams');

  let files: string[];
  if (args.length > 0) {
    // Specific files passed as arguments
    files = args;
  } else {
    // Default: import every JSON in data/exams/
    if (!fs.existsSync(examsDir)) {
      console.error(`Exam directory not found: ${examsDir}`);
      process.exit(1);
    }
    files = fs
      .readdirSync(examsDir)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => path.join('data/exams', f));
  }

  for (const file of files) {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    await seedExam(supabase, filePath);
  }

  console.log('\n=== Seed completed! ===');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
