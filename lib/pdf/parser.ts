/**
 * PDF parser for ENARE-style medical exam PDFs.
 * Port of medpassei/pdf_to_json.py to TypeScript using pdf-parse.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

export interface ParsedQuestion {
  numero: number;
  tags: string[];
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string; E: string };
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

function cleanWatermarks(text: string): string {
  let cleaned = text;
  for (const pattern of WATERMARK_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  // Collapse multiple spaces into one
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

function extractAnswers(text: string): Record<number, string> {
  const answers: Record<number, string> = {};
  const respostasMatch = text.match(/Respostas:/i);
  if (!respostasMatch || respostasMatch.index === undefined) return answers;

  const answerSection = text.slice(respostasMatch.index + respostasMatch[0].length);
  const matches = answerSection.matchAll(/(\d+)\s+([A-E])\b/g);
  for (const m of matches) {
    answers[parseInt(m[1])] = m[2];
  }
  return answers;
}

// Patterns that signal the start of question stem text (not tags)
const QUESTION_STARTERS = [
  /Paciente/i, /Gestante/i, /Mulher/i, /Homem/i, /Um\s+homem/i, /Uma\s+mulher/i,
  /Uma\s+paciente/i, /Um\s+paciente/i, /Uma\s+criança/i, /Um\s+bebê/i,
  /Os\s+pais/i, /Dr\./i, /Dona/i, /Paulo/i, /Marcos/i, /Maria/i, /José/i,
  /Em\s+relação/i, /Sobre\s+[ao]/i, /Referente/i, /Qual/i, /Assinale/i, /Relacione/i,
  /Das\s+opções/i, /Dentre/i, /A\s+presença/i, /Durante/i, /Para\s+bloqueio/i,
  /Você\s+está/i, /Um\s+menino/i, /Uma\s+adolescente/i, /As\s+infecções/i,
  /A\s+glomerulonefrite/i, /A\s+bexiga/i, /A\s+fibrose/i, /Levado/i,
  /São\s+considerados/i, /L\.B\.C/i, /M\.F\.J/i, /M\.J\.F/i, /J\.N\.S/i,
  /Na\s+Hiperplasia/i, /Na\s+fase/i, /A\s+Jbrose/i,
  /Sobre\s+a/i, /Sobre\s+o/i, /Os\s+pacientes/i,
];

function parseSingleQuestion(questionNum: number, content: string): ParsedQuestion | null {
  // Remove "Questão X" prefix
  content = content.replace(/^Questão\s+\d+\s+/, '');

  // Find option boundaries (A through E)
  const optionMatches: { index: number; letter: string; end: number }[] = [];
  const optionRegex = /\n\s*([A-E])\s+/g;
  let match: RegExpExecArray | null;
  while ((match = optionRegex.exec(content)) !== null) {
    optionMatches.push({ index: match.index, letter: match[1], end: match.index + match[0].length });
  }

  if (optionMatches.length === 0) return null;

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

  // Parse tags and question from pre-options text
  const lines = preOptionsText.trim().split('\n');
  const fullPreText = lines.join('\n');

  let tags: string[] = [];
  let questionText = '';

  // Find where question text starts
  let questionStartPos = fullPreText.length;
  for (const starter of QUESTION_STARTERS) {
    const m = fullPreText.match(starter);
    if (m && m.index !== undefined && m.index < questionStartPos) {
      questionStartPos = m.index;
    }
  }

  if (questionStartPos > 0 && questionStartPos < fullPreText.length) {
    const tagsText = cleanWatermarks(fullPreText.slice(0, questionStartPos).trim());
    questionText = fullPreText.slice(questionStartPos).trim();

    const rawTags = tagsText.split(/\s{2,}/);
    for (const tag of rawTags) {
      const t = tag.trim();
      if (t && t.length > 2) {
        tags.push(t);
      }
    }
  } else {
    // Fallback: first line might be tags
    if (lines.length > 0) {
      const tagsLine = cleanWatermarks(lines[0]);
      if (tagsLine.length < 150) {
        tags = tagsLine.split(/\s{2,}/).filter((t) => t.trim()).map((t) => t.trim());
        questionText = lines.slice(1).join('\n');
      } else {
        questionText = lines.join('\n');
      }
    }
  }

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
      E: options['E'] || '',
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
