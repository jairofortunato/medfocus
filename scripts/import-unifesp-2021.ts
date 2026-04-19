/**
 * Import UNIFESP 2021 PDF into data/exams/unifesp-2021.json + Supabase.
 *
 * This PDF has:
 * - 100 multiple-choice questions (A-D, no E)
 * - "Questão N" labels with specialty tags
 * - Answer key on the last page
 * - Watermark text "t.me/medicinalivre" throughout
 * - OCR artifacts: 1→fi, 2→fl, 9→g in some words
 */
import '../lib/pdf/canvas-polyfill';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

config({ path: path.resolve(__dirname, '../.env.local') });

const EXAM_NAME = 'UNIFESP 2021';
const EXAM_SLUG = 'unifesp-2021';

// Medical area mapping from PDF tags
const AREA_MAP: Record<string, string> = {
  'infectologia': 'Infectologia',
  'mortalidade infantil e perinatal': 'Pediatria',
  'sigilo profissional': 'Medicina preventiva',
  'gastroenterologia': 'Gastroenterologia',
  'declaração de óbito': 'Medicina preventiva',
  'filhos de mães com hepatite b': 'Pediatria',
  'esquema vacinal': 'Pediatria',
  'cirurgia': 'Cirurgia',
  'obstetrícia': 'Ginecologia e obstetrícia',
  'ginecologia': 'Ginecologia e obstetrícia',
  'pediatria': 'Pediatria',
  'cardiologia': 'Cardiologia',
  'dermatologia': 'Dermatologia',
  'endocrinologia': 'Endocrinologia',
  'hematologia': 'Hematologia',
  'nefrologia': 'Nefrologia',
  'neurologia': 'Neurologia',
  'oftalmologia': 'Oftalmologia',
  'oncologia': 'Oncologia',
  'ortopedia': 'Ortopedia e traumatologia',
  'otorrinolaringologia': 'Otorrinolaringologia',
  'pneumologia': 'Pneumologia',
  'psiquiatria': 'Psiquiatria',
  'reumatologia': 'Reumatologia',
  'urologia': 'Urologia',
  'medicina preventiva': 'Medicina preventiva',
  'geriatria': 'Geriatria',
  'parto': 'Ginecologia e obstetrícia',
  'neonatologia': 'Pediatria',
  'emergência': 'Cirurgia',
};

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function fixTypography(text: string): string {
  return text
    // Remove watermark text
    .replace(/t\.me\/medicinalivre\d?\s*/gi, '')
    .replace(/proibida venda\s*/gi, '')
    .replace(/cessar Lista\s*/gi, '')
    .replace(/Essa questão po\s*ssui co\s*mentário do pro\s*fesso\s*r no site\s*\d+\s*/gi, '')
    .replace(/4\s*000\d{2,4}\s*\d{1,3}\s*/g, '') // comment IDs
    // UNIFESP-specific: 1 = fi ligature, 2 = fl ligature in many words
    .replace(/1broadenoma/g, 'fibroadenoma')
    .replace(/1brose/g, 'fibrose')
    .replace(/1brina/g, 'fibrina')
    .replace(/1brilação/g, 'fibrilação')
    .replace(/1siológ/g, 'fisiológ')
    .replace(/1siopatolog/g, 'fisiopatolog')
    .replace(/1ístula/g, 'fístula')
    .replace(/1gado/g, 'fígado')
    .replace(/1nal\b/g, 'final')
    .replace(/1lho/g, 'filho')
    .replace(/1lha/g, 'filha')
    .replace(/1ltro/g, 'filtro')
    .replace(/insu1ciência/gi, 'insuficiência')
    .replace(/1culdade/g, 'ficuldade')
    .replace(/di1culdade/gi, 'dificuldade')
    .replace(/1o\b/g, 'fio')
    .replace(/especí1c/g, 'específic')
    .replace(/per1l/g, 'perfil')
    .replace(/tumor1bro/g, 'tumorfibroelástico')  // tumor1broelástico
    .replace(/hiper2uxo/g, 'hiperfluxo')
    .replace(/2ogísticos/g, 'flogísticos')
    .replace(/2exos/g, 'flexos')
    .replace(/re2exo/gi, 'reflexo')
    .replace(/2uxo/g, 'fluxo')
    .replace(/2uidos/g, 'fluidos')
    .replace(/2uido/g, 'fluido')
    .replace(/con2ito/g, 'conflito')
    .replace(/in2amação/gi, 'inflamação')
    .replace(/in2amatóri/gi, 'inflamatóri')
    .replace(/atro1a/g, 'atrofia')
    .replace(/radiogra1a/gi, 'radiografia')
    .replace(/ultrassonogra1a/gi, 'ultrassonografia')
    .replace(/tomogra1a/gi, 'tomografia')
    .replace(/mamogra1a/gi, 'mamografia')
    .replace(/biogra1a/gi, 'biografia')
    .replace(/ecogra1a/gi, 'ecografia')
    // Fix 9 = g in some contexts
    .replace(/\b9\)/g, 'g)')  // "1.750 9)" → "1.750 g)"
    // General fixes
    .replace(/Infeção/g, 'Infecção')
    .replace(/Sindrome/g, 'Síndrome')
    .replace(/prof issional/g, 'profissional')
    .replace(/Inf ectologia/g, 'Infectologia')
    .replace(/Inf ecção/g, 'Infecção')
    .replace(/Amiotróf ica/g, 'Amiotrófica')
    .replace(/Perf urada/g, 'Perfurada')
    .replace(/Def inição/g, 'Definição')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function guessArea(tags: string[]): string {
  for (const tag of tags) {
    const lower = tag.toLowerCase();
    for (const [key, area] of Object.entries(AREA_MAP)) {
      if (lower.includes(key)) return area;
    }
  }
  return 'Medicina preventiva'; // default
}

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const pdfPath = 'C:/Users/usuario/Downloads/UNIFESP 2021.pdf';
  const buf = fs.readFileSync(pdfPath);

  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  console.log(`PDF loaded: ${doc.numPages} pages`);

  // Extract all text page by page
  let fullText = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const pageText = (tc.items as any[]).map((i: any) => i.str).join(' ');
    fullText += ' ' + pageText;
    page.cleanup();
  }
  await doc.destroy();

  // Parse gabarito from last section
  const gabaritoMatch = fullText.match(/Respostas:\s*([\s\S]+)$/);
  const gabarito: Record<number, string> = {};
  if (gabaritoMatch) {
    const pairs = gabaritoMatch[1].matchAll(/(\d+)\s+([A-D])/g);
    for (const m of pairs) {
      gabarito[parseInt(m[1])] = m[2];
    }
  }
  console.log(`Gabarito: ${Object.keys(gabarito).length} respostas`);

  // Parse questions
  const questionBlocks = fullText.split(/Questão\s+(\d+)\s+/);
  // questionBlocks: [before, "1", content1, "2", content2, ...]

  interface ParsedQuestion {
    numero: number;
    tags: string[];
    area: string;
    enunciado: string;
    alternativas: Record<string, string>;
    resposta_correta: string | null;
    explicacao: null;
  }

  const questions: ParsedQuestion[] = [];

  for (let i = 1; i < questionBlocks.length; i += 2) {
    const numero = parseInt(questionBlocks[i]);
    let content = questionBlocks[i + 1] || '';

    // Extract tag (text before the actual question, often specialty name)
    // Pattern: "Infectologia Paciente com..." or "Gastroenterologia Paciente..."
    let tags: string[] = [];

    // Try to extract tag — it's the text before the first sentence
    const tagMatch = content.match(/^([A-ZÀ-Ú][a-záàãâéêíóôõúç\s,]+(?:\s+[A-ZÀ-Ú][a-záàãâéêíóôõúç\s,]+)*)\s+(?=[A-Z](?:aciente|m\s|o\s|ma\s|qual|uando|ual|obre|nd|m\s+relação|e\s+acordo|iante))/);
    if (tagMatch) {
      const tagText = tagMatch[1].trim();
      // Only use as tag if it's short enough to be a specialty
      if (tagText.length < 100) {
        tags = [tagText];
        content = content.substring(tagMatch[0].length - 1).trim();
      }
    }

    // Split into enunciado and alternatives
    const altMatch = content.match(/\s*A\s{2,}(.+?)(?:\s*B\s{2,})(.+?)(?:\s*C\s{2,})(.+?)(?:\s*D\s{2,})(.+?)$/s);

    let enunciado = '';
    const alternativas: Record<string, string> = { A: '', B: '', C: '', D: '' };

    if (altMatch) {
      enunciado = content.substring(0, altMatch.index).trim();
      alternativas.A = altMatch[1].trim();
      alternativas.B = altMatch[2].trim();
      alternativas.C = altMatch[3].trim();
      alternativas.D = altMatch[4].trim();
    } else {
      // Fallback: try splitting by "A " "B " "C " "D " at start of line or after semicolon
      const altMatch2 = content.match(/([\s\S]+?)\s*(?:^|\s)A\s{1,3}([\s\S]+?)\s*(?:^|\s)B\s{1,3}([\s\S]+?)\s*(?:^|\s)C\s{1,3}([\s\S]+?)\s*(?:^|\s)D\s{1,3}([\s\S]+?)$/);
      if (altMatch2) {
        enunciado = altMatch2[1].trim();
        alternativas.A = altMatch2[2].trim();
        alternativas.B = altMatch2[3].trim();
        alternativas.C = altMatch2[4].trim();
        alternativas.D = altMatch2[5].trim();
      } else {
        enunciado = content.trim();
      }
    }

    // Clean up
    enunciado = fixTypography(enunciado);
    for (const key of ['A', 'B', 'C', 'D']) {
      alternativas[key] = fixTypography(alternativas[key]);
      // Remove trailing junk (comment codes, etc.)
      alternativas[key] = alternativas[key].replace(/\s*4\s*000\d+.*$/, '').trim();
    }

    if (!enunciado || enunciado.length < 20) continue;

    const area = guessArea(tags.length > 0 ? tags : [enunciado.substring(0, 50)]);

    questions.push({
      numero,
      tags: tags.length > 0 ? tags : [area],
      area,
      enunciado,
      alternativas,
      resposta_correta: gabarito[numero] || null,
      explicacao: null,
    });
  }

  console.log(`Parsed: ${questions.length} questions`);

  // Save JSON
  const examsDir = path.resolve(__dirname, '../data/exams');
  if (!fs.existsSync(examsDir)) fs.mkdirSync(examsDir, { recursive: true });

  const jsonPayload = {
    prova: EXAM_NAME,
    total_questoes: questions.length,
    questoes: questions,
  };

  const jsonPath = path.join(examsDir, `${EXAM_SLUG}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(jsonPayload, null, 2), 'utf-8');
  console.log(`✓ JSON saved: ${jsonPath}`);

  // Seed to Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Create exam
  const yearMatch = EXAM_NAME.match(/\d{4}/);
  const ano = yearMatch ? parseInt(yearMatch[0]) : 2021;

  const { data: exam, error: examError } = await supabase
    .from('exams')
    .upsert({ slug: EXAM_SLUG, nome: EXAM_NAME, ano, total_questoes: questions.length, is_active: true }, { onConflict: 'slug' })
    .select().single();
  if (examError) { console.error('Exam error:', examError.message); return; }
  console.log(`✓ Exam: ${exam.nome} (${exam.id})`);

  // Upsert tags
  const uniqueTags = new Set<string>();
  questions.forEach((q) => q.tags.forEach((t) => uniqueTags.add(t)));
  const tagRows = [...uniqueTags].map((nome) => ({ nome, slug: slugify(nome) }));
  const { data: tags } = await supabase.from('tags').upsert(tagRows, { onConflict: 'nome' }).select();
  const tagLookup: Record<string, string> = {};
  (tags ?? []).forEach((t: any) => { tagLookup[t.nome] = t.id; });
  console.log(`✓ Tags: ${tags?.length ?? 0}`);

  // Insert questions
  const BATCH = 50;
  const inserted: any[] = [];
  const qRows = questions.filter(q => q.resposta_correta).map((q) => ({
    exam_id: exam.id,
    numero: q.numero,
    enunciado: q.enunciado,
    alternativa_a: q.alternativas.A,
    alternativa_b: q.alternativas.B,
    alternativa_c: q.alternativas.C,
    alternativa_d: q.alternativas.D,
    alternativa_e: null,
    resposta_correta: q.resposta_correta,
    explicacao: null,
    area: q.area,
  }));

  for (let i = 0; i < qRows.length; i += BATCH) {
    const batch = qRows.slice(i, i + BATCH);
    const { data, error } = await supabase.from('questions').upsert(batch, { onConflict: 'exam_id,numero' }).select('id, numero');
    if (error) { console.error(`Q batch error: ${error.message}`); return; }
    inserted.push(...(data ?? []));
  }
  console.log(`✓ Questions: ${inserted.length}`);

  // Question-tag joins
  const qLookup: Record<number, string> = {};
  inserted.forEach((q: any) => { qLookup[q.numero] = q.id; });

  const qtRows: { question_id: string; tag_id: string }[] = [];
  questions.forEach((q) => {
    const qId = qLookup[q.numero];
    if (!qId) return;
    q.tags.forEach((tagName) => {
      const tagId = tagLookup[tagName];
      if (tagId) qtRows.push({ question_id: qId, tag_id: tagId });
    });
  });

  const qIds = inserted.map((q: any) => q.id);
  if (qIds.length > 0) await supabase.from('question_tags').delete().in('question_id', qIds);
  for (let i = 0; i < qtRows.length; i += BATCH) {
    await supabase.from('question_tags').insert(qtRows.slice(i, i + BATCH));
  }
  console.log(`✓ Tag links: ${qtRows.length}`);

  // Extract images
  console.log('\n→ Extracting images...');
  try {
    const { extractPdfImages } = await import('../lib/pdf/image-extractor');
    const images = await extractPdfImages(buf, EXAM_SLUG);

    if (images.length > 0) {
      let linked = 0;
      for (const img of images) {
        const questionId = qLookup[img.questionNumber];
        if (!questionId) continue;
        const { error } = await supabase.from('question_images').upsert({
          question_id: questionId,
          image_url: img.imageUrl,
          image_type: 'figure',
          display_order: 0,
          page_number: img.pageNumber,
        }, { onConflict: 'question_id,image_url', ignoreDuplicates: true });
        if (!error) linked++;
      }
      console.log(`✓ Images: ${images.length} extracted, ${linked} linked`);
    } else {
      console.log('✓ No images found');
    }
  } catch (err: any) {
    console.log(`⚠ Image extraction error: ${err.message}`);
  }

  console.log(`\n🎉 Importação concluída! Prova: /exam/${EXAM_SLUG}`);
}

main().catch((e) => console.error('Fatal:', e));
