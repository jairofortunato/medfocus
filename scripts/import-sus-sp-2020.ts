/**
 * Custom importer for SUS SP 2020
 * Run: npx tsx scripts/import-sus-sp-2020.ts
 */

import { config } from 'dotenv';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PDF_PATH = 'C:/Users/usuario/Downloads/SUS SP 2020.pdf';
const SLUG = 'sus-sp-2020';
const PROVA_NOME = 'SUS SP 2020';
const ANO = 2020;
const OUT_PATH = path.join(process.cwd(), 'data/exams', `${SLUG}.json`);

// ── Fix common OCR ligature artifacts ──────────────────────────────────────
function fixTypo(text: string): string {
  return text
    .replace(/\bcon[Jj]rm/g, 'confirm')    // conJrmou → confirmou
    .replace(/\bde[Jj]ci/g, 'defici')       // deJciência → deficiência
    .replace(/pro[Jj]la/g, 'profila')       // proJlaxia → profilaxia
    .replace(/\b[Jj]bro/g, 'fibro')         // Jbrose → fibrose
    .replace(/\b[Jj]lho/g, 'filho')
    .replace(/([a-z])- ([a-z])/g, '$1$2')   // hyphenated line-breaks: "insu- ficiência" → "insuficiência"
    .replace(/  +/g, ' ')
    .trim();
}

// ── Parse gabarito block ───────────────────────────────────────────────────
function parseGabarito(text: string): Map<number, string> {
  const map = new Map<number, string>();

  // Find "Respostas:" block
  const idx = text.lastIndexOf('Respostas:');
  if (idx === -1) {
    console.error('Gabarito "Respostas:" não encontrado!');
    return map;
  }

  const gabarito = text.slice(idx);
  // Match all "NumberLetter" pairs, e.g. 1B, 23C, 100A
  const re = /(\d{1,3})([A-E])/g;
  let m;
  while ((m = re.exec(gabarito)) !== null) {
    map.set(parseInt(m[1]), m[2]);
  }
  return map;
}

// ── Parse all questions ────────────────────────────────────────────────────
function parseQuestions(text: string) {
  // Split on "Questão N " pattern
  const parts = text.split(/(?=Questão \d+ \n)/);

  const questions: any[] = [];

  for (const part of parts) {
    const headerMatch = part.match(/^Questão (\d+) \n/);
    if (!headerMatch) continue;

    const numero = parseInt(headerMatch[1]);
    const rest = part.slice(headerMatch[0].length);
    const lines = rest.split('\n');

    // First non-empty line(s) before the enunciado = tag
    // Tag line ends before alternatives or main question text
    // The tag is typically 1 line of topic names
    let tagLine = '';
    let enunciadoStart = 0;

    // Find tag: first non-empty line
    for (let i = 0; i < Math.min(lines.length, 4); i++) {
      const l = lines[i].trim();
      if (!l) continue;
      // If this line looks like a tag (doesn't start with A-E followed by content)
      if (!/^[A-E]\s/.test(l)) {
        tagLine = l;
        enunciadoStart = i + 1;
        break;
      }
    }

    // Split tags by known separators (CamelCase run-ons)
    const rawTags = tagLine
      .split(/(?<=[a-záéíóúàâêôãõüç])(?=[A-ZÁÉÍÓÚÀÂÊÔÃÕÜÇ])/)
      .map(t => t.trim())
      .filter(t => t.length > 2 && !/^\d+$/.test(t));

    // Build remaining text for enunciado + alternatives
    const bodyLines = lines.slice(enunciadoStart);
    const body = bodyLines.join('\n');

    // Extract alternatives A-E
    // Pattern: lone letter on its own line (or "A\n", "B\n", etc.)
    const altRegex = /\n([A-E])\n([\s\S]*?)(?=\n[A-E]\n|Essa questão|\d{10}|$)/g;
    const alternativas: Record<string, string> = {};
    let altMatch;
    let firstAltIdx = Infinity;

    const testBody = '\n' + body;
    while ((altMatch = altRegex.exec(testBody)) !== null) {
      const letter = altMatch[1] as 'A'|'B'|'C'|'D'|'E';
      const altText = fixTypo(altMatch[2].replace(/\n/g, ' ').trim());
      alternativas[letter] = altText;
      if (altMatch.index < firstAltIdx) firstAltIdx = altMatch.index;
    }

    // Enunciado = everything before first alternative
    const enunciado = fixTypo(
      testBody.slice(0, firstAltIdx === Infinity ? undefined : firstAltIdx)
        .replace(/^[\n\s]+/, '')
        .replace(/\n/g, ' ')
        .trim()
    );

    if (!alternativas.A) continue; // skip malformed questions

    questions.push({
      numero,
      tags: rawTags,
      enunciado,
      alternativas,
      resposta_correta: null as string | null,
      explicacao: null,
    });
  }

  return questions;
}

async function main() {
  console.log('Lendo PDF...');
  const buf = fs.readFileSync(PDF_PATH);
  const parsed = await pdfParse(buf);
  const text = parsed.text;

  console.log('Parseando gabarito...');
  const gabarito = parseGabarito(text);
  console.log(`Gabarito: ${gabarito.size} respostas encontradas`);

  console.log('Parseando questões...');
  const questions = parseQuestions(text);
  console.log(`Questões parseadas: ${questions.length}`);

  // Apply gabarito
  let withAnswer = 0;
  for (const q of questions) {
    const ans = gabarito.get(q.numero);
    if (ans) {
      q.resposta_correta = ans;
      withAnswer++;
    }
  }
  console.log(`Com gabarito: ${withAnswer}/${questions.length}`);

  // Build JSON
  const examJson = {
    prova: PROVA_NOME,
    total_questoes: questions.length,
    questoes: questions,
  };

  // Preserve existing explanations if any
  if (fs.existsSync(OUT_PATH)) {
    const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
    const expMap = new Map(existing.questoes.map((q: any) => [q.numero, q.explicacao]));
    for (const q of examJson.questoes) {
      if (expMap.has(q.numero)) q.explicacao = expMap.get(q.numero);
    }
    console.log('Explicações existentes preservadas.');
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(examJson, null, 2));
  console.log(`✓ JSON salvo: ${OUT_PATH}`);

  // ── Upsert into Supabase ──────────────────────────────────────────────
  console.log('\nUpserting no Supabase...');

  // Upsert exam
  const { data: examRow, error: examErr } = await supabase
    .from('exams')
    .upsert({ slug: SLUG, nome: PROVA_NOME, ano: ANO, total_questoes: questions.length, is_active: true }, { onConflict: 'slug' })
    .select('id')
    .single();

  if (examErr || !examRow) { console.error('Erro ao upsert exam:', examErr?.message); return; }
  const examId = examRow.id;
  console.log(`Exam ID: ${examId}`);

  // Upsert questions
  let inserted = 0, skipped = 0;
  for (const q of questions) {
    if (!q.resposta_correta) { skipped++; continue; }
    const { error } = await supabase.from('questions').upsert({
      exam_id: examId,
      numero: q.numero,
      enunciado: q.enunciado,
      alternativa_a: q.alternativas.A ?? '',
      alternativa_b: q.alternativas.B ?? '',
      alternativa_c: q.alternativas.C ?? '',
      alternativa_d: q.alternativas.D ?? '',
      alternativa_e: q.alternativas.E ?? null,
      resposta_correta: q.resposta_correta,
      explicacao: q.explicacao ?? null,
      area: null,
      topicos: q.topicos ?? [],
    }, { onConflict: 'exam_id,numero' });
    if (error) { console.error(`  Q${q.numero}:`, error.message); }
    else inserted++;
  }

  console.log(`✓ ${inserted} questões inseridas, ${skipped} sem gabarito`);

  // Update exam total
  const total = questions.filter(q => q.resposta_correta).length;
  await supabase.from('exams').update({ total_questoes: total }).eq('id', examId);
  console.log(`✓ total_questoes atualizado para ${total}`);
}

main().catch(console.error);
