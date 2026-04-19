/**
 * Applies a topicos patch (area + subtopico) to an exam JSON file.
 *
 * Usage:
 *   npx tsx scripts/apply-topicos.ts <exam-slug> <patch-file.json>
 *
 * Patch format:
 * {
 *   "1": [{ "area": "Cardiologia", "subtopico": "Hipertensão Arterial Sistêmica" }],
 *   "5": [
 *     { "area": "Infectologia", "subtopico": "IST/DST" },
 *     { "area": "Pediatria", "subtopico": "Outros Temas Neonatais" }
 *   ]
 * }
 */

import fs from 'fs';
import path from 'path';

const EXAMS_DIR = path.join(process.cwd(), 'data/exams');

interface Topico {
  area: string;
  subtopico: string;
}

type PatchData = Record<string, Topico[]>;

const examSlug = process.argv[2];
const patchFile = process.argv[3];

if (!examSlug || !patchFile) {
  console.error('Usage: npx tsx scripts/apply-topicos.ts <exam-slug> <patch-file.json>');
  process.exit(1);
}

const examPath = path.join(EXAMS_DIR, `${examSlug}.json`);

if (!fs.existsSync(examPath)) {
  console.error(`Exam not found: ${examPath}`);
  process.exit(1);
}

if (!fs.existsSync(patchFile)) {
  console.error(`Patch file not found: ${patchFile}`);
  process.exit(1);
}

const exam = JSON.parse(fs.readFileSync(examPath, 'utf8'));
const patch: PatchData = JSON.parse(fs.readFileSync(patchFile, 'utf8'));

let updated = 0;
let notFound = 0;

for (const questao of exam.questoes) {
  const key = String(questao.numero);
  if (patch[key] !== undefined) {
    questao.topicos = patch[key];
    updated++;
  }
}

// Check for keys in patch that don't exist in exam
for (const key of Object.keys(patch)) {
  const exists = exam.questoes.some((q: any) => String(q.numero) === key);
  if (!exists) {
    console.warn(`  ⚠ Q${key} não encontrada no JSON`);
    notFound++;
  }
}

fs.writeFileSync(examPath, JSON.stringify(exam, null, 2), 'utf8');
console.log(`✓ ${updated} tópicos aplicados em ${examSlug}.json${notFound ? ` (${notFound} não encontradas)` : ''}`);

// Summary: how many questions still have no topicos
const semTopicos = exam.questoes.filter((q: any) => !q.topicos || q.topicos.length === 0).length;
if (semTopicos > 0) {
  console.log(`  ℹ ${semTopicos} questões ainda sem tópico`);
} else {
  console.log(`  ✓ Todas as questões têm tópico`);
}
