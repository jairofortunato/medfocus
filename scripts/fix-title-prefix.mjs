import fs from 'node:fs';
import path from 'node:path';

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

function looksLikeTitle(prefix) {
  const p = prefix.trim();
  if (p.length === 0) return false;
  if (p.length > 200) return false;
  if (/[.?!;:]/.test(p)) return false;
  if (/,\s+[a-záéíóúâêôãõç0-9]/.test(p)) return false;
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
  if (/\d+\s+anos/i.test(p)) return false;
  return true;
}

const dir = 'data/exams';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const summary = {};

for (const f of files) {
  const filePath = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!data.questoes) continue;
  const fixes = [];
  for (const q of data.questoes) {
    const e = q.enunciado || '';
    const idx = findRealStart(e);
    if (idx > 3) {
      const prefix = e.slice(0, idx).trim();
      if (looksLikeTitle(prefix)) {
        q.enunciado = e.slice(idx).trim();
        fixes.push({ numero: q.numero, stripped: prefix });
      }
    }
  }
  if (fixes.length > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    summary[f] = fixes.length;
  }
}

console.log('Summary:');
for (const [f, n] of Object.entries(summary)) console.log(`  ${f}: ${n}`);
console.log(`TOTAL: ${Object.values(summary).reduce((a, b) => a + b, 0)}`);
