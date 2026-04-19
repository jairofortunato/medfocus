/**
 * PDF parser for ENARE-style medical exam PDFs.
 * Port of medpassei/pdf_to_json.py to TypeScript using pdf-parse.
 */

import './canvas-polyfill';

// Use the inner module directly to avoid pdf-parse's index.js trying to
// read a test PDF file at import time (causes ENOENT in bundled environments).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export interface ParsedQuestion {
  numero: number;
  tags: string[];
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E?: string };
  resposta_correta: string | null;
}

export interface ParsedExam {
  prova: string;
  total_questoes: number;
  questoes: ParsedQuestion[];
}

const WATERMARK_PATTERNS = [
  /t\.me\/medicinalivre/gi,
  /Medicina Livre/gi,
  /Contra preços abusivos\s*na medicina\.?/gi,
  /na medicina\./gi,
  /Proibida Venda\.?/gi,
  /Acesse t\.me\/medicinalivre/gi,
  /Acesse.*?medicinalivre/gi,
];

// PDF ligature fixes: broken char → correct text
const LIGATURE_FIXES: [string, string][] = [
  ['8ltração', 'filtração'], ['8lho', 'filho'], ['8lha', 'filha'],
  ['8brose', 'fibrose'], ['8brilação', 'fibrilação'], ['8scalização', 'fiscalização'],
  ['8m de', 'fim de'], ['8gura', 'figura'], ['8nal', 'final'],
  ['8siológic', 'fisiológic'], ['8siopatologi', 'fisiopatologi'],
  ['reRuxo', 'refluxo'], ['inRuenza', 'influenza'], ['inRamatóri', 'inflamatóri'],
  ['conRito', 'conflito'],
  ['e8cácia', 'eficácia'], ['e8caz', 'eficaz'], ['e8ciente', 'eficiente'],
  ['pro8ssão', 'profissão'], ['pro8ssional', 'profissional'],
  ['pro8laxia', 'profilaxia'], ['classi8cad', 'classificad'],
  ['classi8caçã', 'classificaçã'], ['especi8cad', 'especificad'],
  ['modi8cad', 'modificad'], ['insu8ciência', 'insuficiência'],
  ['insu8ciente', 'insuficiente'], ['de8ciência', 'deficiência'],
  ['de8nição', 'definição'], ['signi8cati', 'significati'],
  ['veri8ca', 'verifica'], ['justi8ca', 'justifica'],
  ['insuJciência', 'insuficiência'], ['insuJciente', 'insuficiente'],
  ['deJciência', 'deficiência'], ['deJnição', 'definição'],
  ['Jbrose', 'fibrose'], ['Jbrilação', 'fibrilação'],
  ['identiJca', 'identifica'], ['signiJcati', 'significati'],
  ['veriJca', 'verifica'], ['modiJcad', 'modificad'],
  ['classiJcad', 'classificad'], ['especiJcad', 'especificad'],
  ['justiJca', 'justifica'], ['diJculdad', 'dificuldad'],
  ['diJcultand', 'dificultand'], ['aJrmações', 'afirmações'],
  ['aJrmaçã', 'afirmaçã'], ['superJcial', 'superficial'],
  ['intensiJcad', 'intensificad'], ['quimioproJlaxia', 'quimioprofilaxia'],
  ['proJlaxia', 'profilaxia'], ['radiograJa', 'radiografia'],
  ['mamograJa', 'mamografia'], ['topograJa', 'topografia'],
  ['tomograJa', 'tomografia'], ['ultrassonograJa', 'ultrassonografia'],
  ['UltrassonograJa', 'Ultrassonografia'], ['TomograJa', 'Tomografia'],
  ['Rogístic', 'flogístic'], ['eJcácia', 'eficácia'],
  ['eJciente', 'eficiente'], ['proJssão', 'profissão'],
];

function fixLigatures(text: string): string {
  let fixed = text;
  for (const [broken, correct] of LIGATURE_FIXES) {
    if (fixed.includes(broken)) {
      fixed = fixed.split(broken).join(correct);
    }
  }
  return fixed;
}

function cleanWatermarks(text: string): string {
  let cleaned = text;
  // Strip control characters (null bytes, form feeds, etc.) that break JSON serialization
  // Keep \n, \r, \t as they are normal whitespace
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Fix PDF ligature extraction errors (fi→8, fi→J, fl→R, etc.)
  cleaned = fixLigatures(cleaned);
  for (const pattern of WATERMARK_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  // Collapse multiple spaces into one
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

function extractAnswers(text: string): Record<number, string> {
  const answers: Record<number, string> = {};

  // Try multiple header patterns used across different ENARE PDFs
  const headerPatterns = [
    /Respostas\s*:/i,
    /Gabarito\s*(?:Oficial|Preliminar|Definitivo)?\s*:?/i,
    /GABARITO/,
  ];

  let answerSection: string | null = null;
  for (const pattern of headerPatterns) {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      answerSection = text.slice(match.index + match[0].length);
      break;
    }
  }

  if (!answerSection) return answers;

  // Match patterns like "1 A", "01 - B", "1. C", "1) D", "1C" (compact), etc.
  const matches = answerSection.matchAll(/(\d+)\s*[.\-–)]*\s*([A-E])\b/g);
  for (const m of matches) {
    answers[parseInt(m[1])] = m[2];
  }

  // If few answers found, try compact format "1C2A3B4D..." (no separators)
  if (Object.keys(answers).length < 10) {
    const compactMatches = answerSection.matchAll(/(\d+)([A-E])(?=\d|$|\s)/g);
    for (const m of compactMatches) {
      const num = parseInt(m[1]);
      if (num >= 1 && num <= 200) {
        answers[num] = m[2];
      }
    }
  }
  return answers;
}

// Max character length for a line to be considered a tag line.
// Tag lines are short (specialty names like "Cardiologia", "Diagnóstico do TDAH").
// Enunciado lines are longer (full sentences with clinical cases).
const MAX_TAG_LINE_LENGTH = 80;

function parseSingleQuestion(questionNum: number, content: string): ParsedQuestion | null {
  // Remove "Questão X" prefix
  content = content.replace(/^Questão\s+\d+\s+/, '');

  // Find option boundaries (A through E)
  // Handles both formats:
  //   "\nA " (letter + space on same line) and "\nA\n" (letter alone on its own line)
  const allMatches: { index: number; letter: string; end: number }[] = [];
  const optionRegex = /\n\s*([A-E])\s*\n|\n\s*([A-E])\s+/g;
  let match: RegExpExecArray | null;
  while ((match = optionRegex.exec(content)) !== null) {
    const letter = match[1] || match[2];
    allMatches.push({ index: match.index, letter, end: match.index + match[0].length });
  }

  if (allMatches.length === 0) return null;

  // Find the best consecutive sequence starting from A (A,B,C,D or A,B,C,D,E).
  // Some PDFs have stray single letters that match — we want the actual option block.
  let optionMatches = allMatches;
  if (allMatches.length > 5) {
    // Find all positions where 'A' appears and check for consecutive A,B,C,D(,E)
    let bestStart = -1;
    let bestLen = 0;
    for (let i = 0; i < allMatches.length; i++) {
      if (allMatches[i].letter !== 'A') continue;
      const expected = ['A', 'B', 'C', 'D', 'E'];
      let matched = 0;
      for (let j = 0; j < expected.length && i + j < allMatches.length; j++) {
        if (allMatches[i + j].letter === expected[j]) matched++;
        else break;
      }
      if (matched >= 4 && matched > bestLen) {
        bestLen = matched;
        bestStart = i;
      }
    }
    if (bestStart >= 0) {
      optionMatches = allMatches.slice(bestStart, bestStart + bestLen);
    }
  }

  const firstOptionPos = optionMatches[0].index;
  const preOptionsText = content.slice(0, firstOptionPos);

  // Parse options
  const options: Record<string, string> = {};
  for (let i = 0; i < optionMatches.length; i++) {
    const letter = optionMatches[i].letter;
    const start = optionMatches[i].end;
    let end: number;

    if (i + 1 < optionMatches.length) {
      end = optionMatches[i + 1].index;
    } else {
      const remaining = content.slice(start);
      end = content.length;
      const endMarkers = [/Essa questão possui comentário/, /4\d{9}/];
      for (const marker of endMarkers) {
        const m = remaining.match(marker);
        if (m && m.index !== undefined) {
          end = Math.min(end, start + m.index);
        }
      }
    }

    let optionText = content.slice(start, end);
    optionText = cleanWatermarks(optionText);
    optionText = optionText.replace(/Essa questão possui comentário.*$/, '');
    optionText = optionText.replace(/4\d{9}.*$/, '');
    optionText = optionText.trim();

    if (optionText) {
      options[letter] = optionText;
    }
  }

  // Parse tags and question from pre-options text.
  // Strategy: tag lines are short specialty/topic names at the beginning.
  // Once we hit a line that's long enough to be a sentence (>MAX_TAG_LINE_LENGTH),
  // or the line starts with a roman numeral assertion (I -, II -, etc.),
  // everything from that point on is the enunciado.
  // Lines with periods followed by spaces mid-line (". ") that are also long
  // are sentences, not tags.
  const lines = preOptionsText.trim().split('\n');

  let tags: string[] = [];
  let questionText = '';
  let enunciadoStartIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const cleaned = cleanWatermarks(lines[i]);
    const isLong = cleaned.length > MAX_TAG_LINE_LENGTH;
    const hasRomanNumeral = /^(I|II|III|IV|V)\s*[-–]/.test(cleaned);

    if (isLong || hasRomanNumeral) {
      enunciadoStartIdx = i;
      break;
    }
    enunciadoStartIdx = i + 1;
  }

  // If all lines were classified as tags, the enunciado would be empty.
  // Fallback: keep at most the first 1-2 lines as tags, rest is enunciado.
  if (enunciadoStartIdx >= lines.length) {
    if (lines.length <= 1) {
      // Single short line — treat it as enunciado, not a tag
      enunciadoStartIdx = 0;
    } else {
      // First line(s) are tags, rest is enunciado
      enunciadoStartIdx = Math.min(2, lines.length - 1);
    }
  }

  // Lines before enunciadoStartIdx are tags
  if (enunciadoStartIdx > 0) {
    const tagsText = cleanWatermarks(lines.slice(0, enunciadoStartIdx).join(' '));
    const rawTags = tagsText.split(/\s{2,}/);
    for (const tag of rawTags) {
      const t = tag.trim();
      if (t && t.length > 2) {
        tags.push(t);
      }
    }
  }

  // Everything from enunciadoStartIdx is the question text
  questionText = lines.slice(enunciadoStartIdx).join('\n');

  questionText = cleanWatermarks(questionText);

  if (Object.keys(options).length === 0 || !questionText) return null;

  return {
    numero: questionNum,
    tags,
    enunciado: questionText,
    alternativas: {
      A: options['A'] || '',
      B: options['B'] || '',
      C: options['C'] || '',
      D: options['D'] || '',
      ...(options['E'] ? { E: options['E'] } : {}),
    },
    resposta_correta: null,
  };
}

function parseQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  // Find all question positions
  const questionStarts: { pos: number; num: number }[] = [];
  const qRegex = /Questão\s+(\d+)\s+/g;
  let m: RegExpExecArray | null;
  while ((m = qRegex.exec(text)) !== null) {
    questionStarts.push({ pos: m.index, num: parseInt(m[1]) });
  }

  // Find end of questions
  const respostasMatch = text.match(/Respostas:/i);
  const endPos = respostasMatch?.index ?? text.length;

  for (let i = 0; i < questionStarts.length; i++) {
    const start = questionStarts[i].pos;
    const end = i + 1 < questionStarts.length ? questionStarts[i + 1].pos : endPos;
    const questionText = text.slice(start, end);
    const parsed = parseSingleQuestion(questionStarts[i].num, questionText);
    if (parsed) {
      questions.push(parsed);
    }
  }

  return questions;
}

export async function parsePdf(buffer: Buffer, examName: string): Promise<ParsedExam> {
  const data = await pdfParse(buffer);
  const text: string = data.text;

  const answers = extractAnswers(text);
  const questions = parseQuestions(text);

  // Assign correct answers
  for (const q of questions) {
    if (answers[q.numero]) {
      q.resposta_correta = answers[q.numero];
    }
  }

  return {
    prova: examName,
    total_questoes: questions.length,
    questoes: questions,
  };
}
