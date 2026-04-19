/**
 * Fix OCR ligature errors in famerp-2020.json
 * The PDF has "fi" where "M" should be (broken ligature mapping).
 */
import * as fs from 'fs';
import * as path from 'path';

const jsonPath = path.resolve(__dirname, '../data/exams/famerp-2020.json');
let text = fs.readFileSync(jsonPath, 'utf-8');

// Specific known replacements (fi → M when it should be M)
const replacements: [RegExp, string][] = [
  // Common words where fi = M
  [/\bfiulher/g, 'Mulher'],
  [/\bfiulheres/g, 'Mulheres'],
  [/\bfiortalidade/g, 'Mortalidade'],
  [/\bfieningocócica/g, 'Meningocócica'],
  [/\bfieningite/g, 'Meningite'],
  [/\bfieningococo/g, 'Meningococo'],
  [/\bfiedidas/g, 'Medidas'],
  [/\bfiedida/g, 'Medida'],
  [/\bfiedicamento/g, 'Medicamento'],
  [/\bfiedicamentos/g, 'Medicamentos'],
  [/\bfiedicina/g, 'Medicina'],
  [/\bfiedico/g, 'Médico'],
  [/\bfiedica/g, 'Médica'],
  [/\bfiédico/g, 'Médico'],
  [/\bfiédica/g, 'Médica'],
  [/\bfiental/g, 'Mental'],
  [/\bfientais/g, 'Mentais'],
  [/\bfiamografia/g, 'Mamografia'],
  [/\bfiamografico/g, 'Mamográfico'],
  [/\bfiama/g, 'Mama'],
  [/\bfiamas/g, 'Mamas'],
  [/\bfianobras/g, 'Manobras'],
  [/\bfianobra/g, 'Manobra'],
  [/\bfiaior/g, 'Maior'],
  [/\bfiaioria/g, 'Maioria'],
  [/\bfialigna/g, 'Maligna'],
  [/\bfialigno/g, 'Maligno'],
  [/\bfialignidade/g, 'Malignidade'],
  [/\bfianifest/g, 'Manifest'],
  [/\bfienor/g, 'Menor'],
  [/\bfienores/g, 'Menores'],
  [/\bfienstrual/g, 'Menstrual'],
  [/\bfieses/g, 'Meses'],
  [/\bfietástase/g, 'Metástase'],
  [/\bfietástases/g, 'Metástases'],
  [/\bfietabólico/g, 'Metabólico'],
  [/\bfietabólica/g, 'Metabólica'],
  [/\bfietabolismo/g, 'Metabolismo'],
  [/\bfietformina/g, 'Metformina'],
  [/\bfiinistério/g, 'Ministério'],
  [/\bfiinist/g, 'Minist'],
  [/\bfiicroscopia/g, 'Microscopia'],
  [/\bfiicrobiologia/g, 'Microbiologia'],
  [/\bfiicro/g, 'Micro'],
  [/\bfiinutos/g, 'Minutos'],
  [/\bfiinuto/g, 'Minuto'],
  [/\bfiocárdio/g, 'Miocárdio'],
  [/\bfiiocard/g, 'Miocard'],
  [/\bfionitor/g, 'Monitor'],
  [/\bfiorte/g, 'Morte'],
  [/\bfiortes/g, 'Mortes'],
  [/\bfiorbidade/g, 'Morbidade'],
  [/\bfiorbi/g, 'Morbi'],
  [/\bfiov/g, 'Mov'],
  [/\bfilis/g, 'Sífilis'], // special: "filis" should be "Sífilis" but "Sí" was stripped
  [/\bsí filis/gi, 'sífilis'],

  // Fix spaces in compound words from PDF
  [/Inf ectologia/g, 'Infectologia'],
  [/Inf ecção/g, 'Infecção'],
  [/prof issional/g, 'profissional'],
  [/contra- indicad/g, 'contraindicad'],
  [/identi ficou/g, 'identificou'],
  [/identiMcou/g, 'identificou'],

  // Fix remaining artifacts
  [/\b0001278\s*\d{1,2}/g, ''], // comment IDs
  [/perMl/g, 'perfil'],
  [/Mscal/g, 'Fiscal'],
  [/Mltro/g, 'Filtro'],
  [/Mbrose/g, 'Fibrose'],
  [/Mbrina/g, 'Fibrina'],
  [/Mbrino/g, 'Fibrino'],
  [/Mbrilação/g, 'Fibrilação'],
  [/Msiológico/g, 'Fisiológico'],
  [/Msiopatologia/g, 'Fisiopatologia'],
  [/Místula/g, 'Fístula'],
  [/Mgado/g, 'Fígado'],
  [/Mnal/g, 'Final'],
  [/Mlha/g, 'Filha'],
  [/Mlho/g, 'Filho'],
];

let fixCount = 0;
for (const [pattern, replacement] of replacements) {
  const matches = text.match(pattern);
  if (matches) {
    fixCount += matches.length;
    text = text.replace(pattern, replacement);
  }
}

// Also fix "sí" appearing before "filis" → "sífilis"
text = text.replace(/sí\s*filis/gi, 'sífilis');

fs.writeFileSync(jsonPath, text, 'utf-8');
console.log(`✓ ${fixCount} OCR fixes applied to famerp-2020.json`);

// Verify remaining "fi" suspects
const remaining = text.match(/\bfi[a-záàãâéêíóôõúç]{2,}/g) ?? [];
const suspectCounts: Record<string, number> = {};
remaining.forEach((w) => { suspectCounts[w] = (suspectCounts[w] || 0) + 1; });
const suspects = Object.entries(suspectCounts)
  .filter(([w]) => !['final', 'filho', 'filha', 'filhos', 'filhas', 'filtro', 'fibrose', 'fibrina', 'fibrilação', 'fisiológico', 'fisiopatologia', 'fístula', 'fígado', 'fisiológica', 'fica', 'ficar', 'ficou', 'firmado', 'firmar', 'firma', 'fino', 'fina'].includes(w.toLowerCase()))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

if (suspects.length > 0) {
  console.log('\nRemaining "fi" suspects (may need manual review):');
  suspects.forEach(([w, c]) => console.log(`  ${c}x: ${w}`));
}
