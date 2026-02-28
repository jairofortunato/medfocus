/**
 * OpenAI GPT-4o integration for generating medical exam explanations.
 * Mirrors the prompt from generate_explanations.py.
 */

import OpenAI from 'openai';

const SYSTEM_PROMPT =
  'Você é um professor de medicina especializado em preparação para residência médica. Suas explicações são concisas, precisas e educativas.';

function buildUserPrompt(
  enunciado: string,
  alternativas: Record<string, string>,
  respostaCorreta: string
): string {
  const alternativasTexto = Object.entries(alternativas)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return `Você é um especialista em medicina preparando estudantes para o ENARE.

Questão: ${enunciado}

Alternativas:
${alternativasTexto}

Resposta correta: ${respostaCorreta}

Escreva uma explicação CONCISA e OBJETIVA (máximo 150 palavras) em português explicando:
1. Por que a alternativa ${respostaCorreta} é a correta
2. O conceito médico fundamental envolvido
3. Se relevante, por que as outras alternativas estão incorretas

Seja direto, técnico e educativo. Foque no essencial.`;
}

export async function generateExplanation(
  enunciado: string,
  alternativas: Record<string, string>,
  respostaCorreta: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(enunciado, alternativas, respostaCorreta) },
    ],
    max_tokens: 400,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}
