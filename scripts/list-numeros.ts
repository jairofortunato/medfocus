import fs from 'fs';
import path from 'path';
const slug = process.argv[2];
const d = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/exams/${slug}.json`), 'utf-8'));
console.log('Total:', d.questoes.length);
console.log('Números:', d.questoes.map((q: any) => q.numero).join(','));
