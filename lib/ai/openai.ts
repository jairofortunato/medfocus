/**
 * Anthropic Claude integration for generating medical exam explanations
 * and answering questions without answer keys.
 */

import Anthropic from '@anthropic-ai/sdk';

import { MEDICAL_AREAS, MedicalArea } from '../config/medical-areas';

const SYSTEM_PROMPT = `Você é um professor de medicina especializado em preparação para residência médica (foco no ENARE).
Suas explicações são concisas, precisas e educativas.

Sua tarefa central é classificar cada questão em EXATAMENTE UMA das seguintes 21 GRANDES ÁREAS:
${MEDICAL_AREAS.join(', ')}.

REGRAS CRÍTICAS DE CLASSIFICAÇÃO:
1. NÃO use categorias fora desta lista.
2. Questões sobre Bioética, Ética Médica, Epidemiologia, Estatística Vital e Saúde Pública DEVEM ser classificadas como "Medicina preventiva".
3. Se houver dúvida entre duas áreas, escolha a que representa o sistema orgânico ou a especialidade predominante no enunciado.

IMPORTANTE: Retorne APENAS JSON válido, sem nenhum texto adicional antes ou depois do JSON.`;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada. Adicione ao .env.local');
  }
  return new Anthropic({ apiKey });
}

function extractJSON(text: string): Record<string, unknown> {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Extract JSON from markdown code blocks or surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  }
}

function buildUserPrompt(
  enunciado: string,
  alternativas: Record<string, string>,
  respostaCorreta: string
): string {
  const alternativasTexto = Object.entries(alternativas)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return `Questão: ${enunciado}

Alternativas:
${alternativasTexto}

Resposta correta: ${respostaCorreta}

Sua tarefa:
1. Classifique a questão em uma das grandes áreas mencionadas no prompt de sistema.
2. Escreva uma explicação em português que:
   - Explique por que a alternativa ${respostaCorreta} é a correta.
   - Se o tema exigir, adicione informações relevantes sobre a doença/condição para aprendizado.
   - Explique brevemente por que as demais alternativas estão erradas.

Seja direto e conciso. Aprofunde apenas quando o tema realmente exigir para o aprendizado.

Retorne APENAS um objeto JSON no seguinte formato:
{
  "area": "Nome da Área",
  "explicacao": "Sua explicação aqui..."
}`;
}

export interface ExplanationResult {
  area: MedicalArea;
  explicacao: string;
}

export interface AnswerAndExplanationResult extends ExplanationResult {
  resposta_correta: 'A' | 'B' | 'C' | 'D' | 'E';
}

function buildAnswerPrompt(
  enunciado: string,
  alternativas: Record<string, string>
): string {
  const alternativasTexto = Object.entries(alternativas)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const letters = Object.keys(alternativas).join(', ');

  return `Questão: ${enunciado}

Alternativas:
${alternativasTexto}

Sua tarefa:
1. Analise a questão cuidadosamente e determine a alternativa CORRETA (${letters}).
2. Classifique a questão em uma das grandes áreas mencionadas no prompt de sistema.
3. Escreva uma explicação em português que:
   - Explique por que a alternativa escolhida é a correta.
   - Se o tema exigir, adicione informações relevantes sobre a doença/condição para aprendizado.
   - Explique brevemente por que as demais alternativas estão erradas.

Seja direto e conciso. Aprofunde apenas quando o tema realmente exigir para o aprendizado.

Retorne APENAS um objeto JSON no seguinte formato:
{
  "resposta_correta": "A",
  "area": "Nome da Área",
  "explicacao": "Sua explicação aqui..."
}`;
}

export async function answerAndExplain(
  enunciado: string,
  alternativas: Record<string, string>
): Promise<AnswerAndExplanationResult> {
  const client = getClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: buildAnswerPrompt(enunciado, alternativas) },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  const content = textBlock && 'text' in textBlock ? textBlock.text.trim() : '{}';

  try {
    const result = extractJSON(content);

    const answer = (result.resposta_correta as string)?.toUpperCase();
    if (!['A', 'B', 'C', 'D', 'E'].includes(answer)) {
      throw new Error(`Invalid answer: ${result.resposta_correta}`);
    }

    if (!MEDICAL_AREAS.includes(result.area as MedicalArea)) {
      console.warn(`AI returned invalid area: ${result.area}.`);
    }

    return {
      resposta_correta: answer as 'A' | 'B' | 'C' | 'D' | 'E',
      area: result.area as MedicalArea,
      explicacao: (result.explicacao as string) || 'Explicação não gerada.',
    };
  } catch (e) {
    console.error('Failed to parse AI answer response:', content);
    throw new Error('Failed to generate valid answer and explanation');
  }
}

export async function generateExplanation(
  enunciado: string,
  alternativas: Record<string, string>,
  respostaCorreta: string
): Promise<ExplanationResult> {
  const client = getClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: buildUserPrompt(enunciado, alternativas, respostaCorreta) },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  const content = textBlock && 'text' in textBlock ? textBlock.text.trim() : '{}';

  try {
    const result = extractJSON(content);

    if (!MEDICAL_AREAS.includes(result.area as MedicalArea)) {
      console.warn(`AI returned invalid area: ${result.area}. Defaulting to undefined.`);
    }

    return {
      area: result.area as MedicalArea,
      explicacao: (result.explicacao as string) || 'Explicação não gerada.',
    };
  } catch (e) {
    console.error('Failed to parse AI response as JSON:', content);
    throw new Error('Failed to generate valid explanation and classification');
  }
}
