import fs from 'node:fs';
import path from 'node:path';

// Case-opening markers. When these words appear *not at the start* of an enunciado,
// everything before them is likely a PDF-extracted title/header that should be stripped.
const demographicOpeners = [
  'Homem', 'Mulher', 'Menino', 'Menina', 'Lactente',
  'Recém-nascido', 'Recém nascido', 'Recem-nascido', 'Recem nascido',
  'Recém-nascida', 'Recém nascida', 'Recém-nata',
  'Gestante', 'Adolescente', 'Criança', 'Primigesta', 'Secundigesta',
  'Multigesta', 'Motorista', 'Neonato', 'Paciente', 'Jovem', 'Idoso',
  'Adulto', 'Idosa', 'Puérpera', 'Nutriz', 'Primípara', 'Multípara',
  'Mulheres', 'Homens', 'Crianças', 'Adolescentes', 'Gestantes', 'Lactentes',
  'Pacientes', 'Escolar', 'Pré-escolar', 'Senhora', 'Senhor',
];

const genericOpeners = [
  'Um homem', 'Uma mulher', 'Um menino', 'Uma menina', 'Um lactente',
  'Um recém-nascido', 'Uma recém-nascida', 'Uma gestante', 'Um adolescente',
  'Uma adolescente', 'Uma criança', 'Um paciente', 'Uma paciente',
  'Um jovem', 'Uma jovem', 'Um idoso', 'Uma idosa', 'Um adulto', 'Uma adulta',
  'Assinale', 'Considere', 'Considerando', 'De acordo',
  'Em relação', 'Qual', 'Quais', 'Segundo o', 'Segundo a', 'Segundo as',
  'Em que', 'No Brasil', 'No âmbito', 'Na atenção', 'Para a', 'Para o',
  'Para verificar', 'Para investigação', 'Para o controle', 'Para prevenção',
  'Sobre essa', 'Sobre esse', 'Sobre este', 'Sobre esta', 'Sobre o',
  'Você', 'Dentre', 'Diante', 'Observa-se', 'Toda', 'Todo',
  'Trinta', 'Algumas', 'As doenças', 'Os médicos', 'As características',
  'Nas situações', 'Nos dados', 'Nessa', 'Nesse', 'Neste', 'Nesta',
  'Realizou-se', 'Realizou', 'No atendimento', 'Após',
  'A partir', 'No contexto',
];

const allMarkers = [...demographicOpeners, ...genericOpeners];

function escapeRe(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function findRealStart(text) {
  let earliestIdx = -1;
  for (const marker of allMarkers) {
    const re = new RegExp('\\b' + escapeRe(marker) + '\\b');
    const m = re.exec(text);
    if (m && (earliestIdx === -1 || m.index < earliestIdx)) {
      earliestIdx = m.index;
    }
  }
  return earliestIdx;
}

// Heuristic: a "title prefix" looks like concatenated topic labels —
// no sentence-ending punctuation, no comma+space+lowercase (sentence continuation),
// no conjugated verbs.
function looksLikeTitle(prefix) {
  const p = prefix.trim();
  if (p.length === 0) return false;
  if (p.length > 200) return false;
  // Any period, question mark, semicolon, colon, or exclamation → looks like a sentence
  if (/[.?!;:]/.test(p)) return false;
  // Comma followed by a lowercase word → sentence continuation (e.g. "Paulo, 41 anos")
  if (/,\s+[a-záéíóúâêôãõç0-9]/.test(p)) return false;
  // Conjugated verbs / sentence-forming auxiliaries
  const verbs = [
    '\\bé\\b', '\\bsão\\b', '\\bfoi\\b', '\\bforam\\b', '\\btem\\b', '\\bteve\\b', '\\btêm\\b',
    '\\bfaz\\b', '\\bfazia\\b', '\\bficou\\b', '\\bapresenta\\b', '\\bapresentou\\b',
    '\\bapresentam\\b', '\\brefere\\b', '\\brelatou\\b', '\\bchega\\b', '\\bchegou\\b',
    '\\bprocura\\b', '\\bprocurou\\b', '\\bvem\\b', '\\bestá\\b', '\\bestão\\b',
    '\\brealizou\\b', '\\bsofreu\\b', '\\bnasceu\\b', '\\badmitido\\b', '\\badmitida\\b',
    '\\bdeu\\b', '\\bacordou\\b', '\\bcomeçou\\b', '\\bevoluiu\\b', '\\bpode\\b', '\\bdevem\\b',
    '\\bdeve\\b', '\\brealiza\\b', '\\bhá\\b',
  ];
  if (new RegExp(verbs.join('|'), 'i').test(p)) return false;
  // Digits with age pattern like "45 anos"
  if (/\d+\s+anos/i.test(p)) return false;
  return true;
}

const dir = 'data/exams';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const affected = {};

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (!data.questoes) continue;
  const items = [];
  for (const q of data.questoes) {
    const e = q.enunciado || '';
    const idx = findRealStart(e);
    if (idx > 3) {
      const prefix = e.slice(0, idx).trim();
      if (looksLikeTitle(prefix)) {
        items.push({
          numero: q.numero,
          prefix,
          realStart: e.slice(idx, idx + 80),
        });
      }
    }
  }
  if (items.length) affected[f] = items;
}

for (const [f, items] of Object.entries(affected)) {
  console.log(`\n=== ${f}: ${items.length} affected ===`);
  items.forEach((x) => {
    console.log(`  #${x.numero}: [${x.prefix.slice(0, 80)}] -> ${x.realStart.slice(0, 50)}`);
  });
}

const total = Object.values(affected).reduce((a, b) => a + b.length, 0);
console.log(`\nTOTAL affected: ${total}`);
