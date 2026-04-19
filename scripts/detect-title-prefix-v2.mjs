// v2: detect title prefixes by pattern (Title Case sequence without sentence structure)
// independent of what comes after.
import fs from 'node:fs';
import path from 'node:path';

// A title prefix looks like:
//   [Capital word] ([Capital word | lowercase connector])+
// where connectors are: de, da, do, das, dos, e, em, com, para, a, o, às, à, na, no, nas, nos
// and the whole thing has no verb / no comma+lowercase / no sentence punctuation.

const CONNECTORS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'com', 'para', 'a', 'o', 'às',
  'à', 'na', 'no', 'nas', 'nos', 'por', 'ao', 'aos', 'pela', 'pelo', 'pelas', 'pelos',
]);

// Words that, if seen at start, mean it's NOT a title (the actual question)
const REAL_START_HINTS = [
  /^[A-Z][a-záéíóúâêôãõç]+,/, // "Paulo," "Mulher," etc. (noun + comma = real case)
  /^[A-Z]\.\s*[A-Z]\./, // "L. B." initials
  /\d+\s+anos/i, // age indicator
];

function isCapital(word) {
  return /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(word);
}

function hasVerb(text) {
  const verbs = [
    'é', 'são', 'foi', 'foram', 'tem', 'teve', 'têm', 'faz', 'fazia', 'ficou',
    'apresenta', 'apresentou', 'apresentam', 'refere', 'relatou', 'chega', 'chegou',
    'procura', 'procurou', 'vem', 'está', 'estão', 'realizou', 'sofreu', 'nasceu',
    'admitido', 'admitida', 'deu', 'acordou', 'começou', 'evoluiu', 'pode', 'devem',
    'deve', 'realiza', 'há', 'compareceu', 'trazida', 'trazido', 'internada', 'internado',
    'levada', 'levado', 'hígido', 'hígida', 'diabética', 'diabético',
  ];
  const re = new RegExp('\\b(' + verbs.join('|') + ')\\b', 'i');
  return re.test(text);
}

function detectTitlePrefix(text) {
  // Find where the title ends and the real question begins.
  // Strategy: consume words from left as long as they match title pattern.
  // Title word = capital-starting OR a small connector.
  // Stop when we see:
  //   - sentence punctuation (., ?, !, ;, :)
  //   - comma
  //   - a verb
  //   - a digit with "anos"
  //   - end reached

  const words = text.split(/\s+/);
  let titleEndIdx = 0; // index in the words array where title ends
  let charPos = 0;
  let lastCapitalPos = -1; // char position of the last capitalized word in the title

  for (let i = 0; i < words.length && i < 50; i++) {
    const w = words[i];
    if (!w) break;

    // Check for punctuation in the word itself
    if (/[.?!;:,]/.test(w) && !w.endsWith('.')) {
      // word contains punctuation → probably sentence
      break;
    }
    if (w.endsWith(',') || w.endsWith('.') || w.endsWith(':') || w.endsWith(';') || w.endsWith('?') || w.endsWith('!')) {
      break;
    }
    // Check for age pattern
    if (/^\d+$/.test(w) && i + 1 < words.length && /^anos?/i.test(words[i + 1])) {
      break;
    }
    // Check if it's a verb
    if (hasVerb(w)) {
      break;
    }

    const isCon = CONNECTORS.has(w.toLowerCase());
    const isCap = isCapital(w);

    if (isCap) {
      lastCapitalPos = charPos + w.length;
      titleEndIdx = i + 1;
    } else if (isCon) {
      // connector is allowed but doesn't extend title by itself
      // it's only meaningful if a capital comes after
    } else {
      // lowercase non-connector → end of title
      break;
    }

    charPos += w.length + 1; // +1 for space
  }

  // A title must have at least 2 capital words (to avoid single noun false positives)
  const titleWords = words.slice(0, titleEndIdx);
  const capCount = titleWords.filter(isCapital).length;
  if (capCount < 2) return -1;
  if (titleEndIdx >= words.length) return -1; // the whole text is "title" (probably a normal question)

  // Reconstruct char position up to lastCapitalPos
  // Actually we want the position right after the last capital word that's part of the title.
  let pos = 0;
  for (let i = 0; i < titleEndIdx; i++) {
    pos += words[i].length + 1;
  }

  // Check that text after title looks like a real question start
  const rest = text.slice(pos).trim();
  if (rest.length < 20) return -1;

  return pos;
}

const dir = 'data/exams';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (!data.questoes) continue;
  const items = [];
  for (const q of data.questoes) {
    const e = q.enunciado || '';
    const idx = detectTitlePrefix(e);
    if (idx > 3) {
      items.push({
        numero: q.numero,
        prefix: e.slice(0, idx).trim(),
        realStart: e.slice(idx, idx + 80).trim(),
      });
    }
  }
  if (items.length) {
    console.log(`\n=== ${f}: ${items.length} ===`);
    items.forEach((x) => console.log(`  #${x.numero}: [${x.prefix.slice(0, 70)}] -> ${x.realStart.slice(0, 50)}`));
  }
}
