/**
 * Apply a batch of hand-written explanations to a data/exams/<slug>.json file.
 *
 * Usage:
 *   npx tsx scripts/apply-explicacoes.ts <slug> <patch-json-path>
 *
 * Patch file format (JSON):
 *   { "1": "explicação completa...", "2": "outra...", ... }
 * Keys are question numbers (numero), values are the new explicacao text.
 */

import fs from 'fs';
import path from 'path';

const [slug, patchPath] = process.argv.slice(2);
if (!slug || !patchPath) {
  console.error('Usage: npx tsx scripts/apply-explicacoes.ts <slug> <patch-json-path>');
  process.exit(1);
}

const examPath = path.resolve(__dirname, `../data/exams/${slug}.json`);
if (!fs.existsSync(examPath)) {
  console.error(`Exam file not found: ${examPath}`);
  process.exit(1);
}
if (!fs.existsSync(patchPath)) {
  console.error(`Patch file not found: ${patchPath}`);
  process.exit(1);
}

const exam = JSON.parse(fs.readFileSync(examPath, 'utf-8'));
const patch: Record<string, string> = JSON.parse(fs.readFileSync(patchPath, 'utf-8'));

let updated = 0;
let missing: string[] = [];
for (const [numeroStr, explicacao] of Object.entries(patch)) {
  const numero = Number(numeroStr);
  const q = exam.questoes.find((x: any) => x.numero === numero);
  if (!q) {
    missing.push(numeroStr);
    continue;
  }
  q.explicacao = explicacao;
  updated++;
}

fs.writeFileSync(examPath, JSON.stringify(exam, null, 2), 'utf-8');
console.log(`✓ ${updated} explicações atualizadas em ${slug}.json`);
if (missing.length > 0) console.log(`⚠ Não encontradas: ${missing.join(', ')}`);
