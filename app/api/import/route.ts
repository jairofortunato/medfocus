import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { parsePdf } from '@/lib/pdf/parser';
import { generateExplanation } from '@/lib/ai/openai';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minute timeout for long explanation generation

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sseEvent(type: string, data: Record<string, unknown>): string {
  return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

export async function POST(request: NextRequest) {
  // Auth check using the user's session
  const authClient = createServerClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Service role client to bypass RLS for content inserts
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Server misconfigured: missing service role key' }), { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Parse form data
  const formData = await request.formData();
  const file = formData.get('pdf') as File | null;
  const examName = (formData.get('examName') as string)?.trim();

  if (!file || !examName) {
    return new Response(JSON.stringify({ error: 'Missing PDF file or exam name' }), { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: 'File too large (max 10MB)' }), { status: 400 });
  }

  // SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(type, data)));
      };

      try {
        // 1. Parse PDF
        send('progress', { message: 'Extraindo texto do PDF...' });
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = await parsePdf(buffer, examName);

        if (parsed.questoes.length === 0) {
          send('error', { message: 'Nenhuma questão encontrada no PDF. Verifique o formato.' });
          controller.close();
          return;
        }

        const withAnswers = parsed.questoes.filter((q) => q.resposta_correta).length;
        send('progress', {
          message: `Encontradas ${parsed.questoes.length} questões (${withAnswers} com gabarito)`,
        });

        // 2. Create exam record
        send('progress', { message: 'Criando registro da prova...' });
        const examSlug = slugify(examName);
        const yearMatch = examName.match(/\d{4}/);
        const ano = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();

        const { data: exam, error: examError } = await supabase
          .from('exams')
          .upsert(
            {
              slug: examSlug,
              nome: examName,
              ano,
              total_questoes: parsed.questoes.length,
              is_active: true,
            },
            { onConflict: 'slug' }
          )
          .select()
          .single();

        if (examError) {
          send('error', { message: `Erro ao criar prova: ${examError.message}` });
          controller.close();
          return;
        }

        // 3. Upsert tags
        send('progress', { message: 'Criando tags...' });
        const uniqueTags = new Set<string>();
        parsed.questoes.forEach((q) => q.tags.forEach((t) => uniqueTags.add(t)));

        const tagRows = [...uniqueTags].map((nome) => ({
          nome,
          slug: slugify(nome),
        }));

        let tags: { id: string; nome: string }[] = [];
        if (tagRows.length > 0) {
          const { data: tagsData, error: tagsError } = await supabase
            .from('tags')
            .upsert(tagRows, { onConflict: 'nome' })
            .select();

          if (tagsError) {
            send('error', { message: `Erro ao criar tags: ${tagsError.message}` });
            controller.close();
            return;
          }
          tags = tagsData ?? [];
        }

        const tagLookup: Record<string, string> = {};
        tags.forEach((t) => { tagLookup[t.nome] = t.id; });

        // 4. Insert questions (without explanations)
        send('progress', { message: 'Inserindo questões...' });
        const BATCH_SIZE = 50;
        const insertedQuestions: { id: string; numero: number }[] = [];

        const questionRows = parsed.questoes.map((q) => ({
          exam_id: exam.id,
          numero: q.numero,
          enunciado: q.enunciado,
          alternativa_a: q.alternativas.A,
          alternativa_b: q.alternativas.B,
          alternativa_c: q.alternativas.C,
          alternativa_d: q.alternativas.D,
          alternativa_e: q.alternativas.E,
          resposta_correta: q.resposta_correta,
          explicacao: null,
        }));

        for (let i = 0; i < questionRows.length; i += BATCH_SIZE) {
          const batch = questionRows.slice(i, i + BATCH_SIZE);
          const { data, error } = await supabase
            .from('questions')
            .upsert(batch, { onConflict: 'exam_id,numero' })
            .select('id, numero');

          if (error) {
            send('error', { message: `Erro ao inserir questões (batch ${i}): ${error.message}` });
            controller.close();
            return;
          }
          insertedQuestions.push(...(data ?? []));
        }

        send('progress', { message: `${insertedQuestions.length} questões inseridas` });

        // 5. Create question_tags joins
        const questionLookup: Record<number, string> = {};
        insertedQuestions.forEach((q) => { questionLookup[q.numero] = q.id; });

        const questionTagRows: { question_id: string; tag_id: string }[] = [];
        parsed.questoes.forEach((q) => {
          const questionId = questionLookup[q.numero];
          if (!questionId) return;
          q.tags.forEach((tagName) => {
            const tagId = tagLookup[tagName];
            if (!tagId) return;
            questionTagRows.push({ question_id: questionId, tag_id: tagId });
          });
        });

        // Delete existing question_tags for this exam's questions
        const questionIdsForExam = insertedQuestions.map((q) => q.id);
        if (questionIdsForExam.length > 0) {
          await supabase
            .from('question_tags')
            .delete()
            .in('question_id', questionIdsForExam);
        }

        for (let i = 0; i < questionTagRows.length; i += BATCH_SIZE) {
          const batch = questionTagRows.slice(i, i + BATCH_SIZE);
          await supabase.from('question_tags').insert(batch);
        }

        send('progress', { message: `${questionTagRows.length} tag-links criados` });

        // 6. Generate explanations with OpenAI (if API key available)
        const hasOpenAiKey = !!process.env.OPENAI_API_KEY;
        const questionsWithAnswer = parsed.questoes.filter((q) => q.resposta_correta);

        if (!hasOpenAiKey) {
          send('progress', {
            message: 'OPENAI_API_KEY não configurada — pulando geração de explicações',
          });
        } else if (questionsWithAnswer.length === 0) {
          send('progress', { message: 'Nenhuma questão com gabarito — pulando explicações' });
        } else {
          send('progress', {
            message: `Gerando explicações para ${questionsWithAnswer.length} questões...`,
          });

          for (let i = 0; i < questionsWithAnswer.length; i++) {
            const q = questionsWithAnswer[i];
            const questionId = questionLookup[q.numero];
            if (!questionId) continue;

            send('explanation', {
              message: `Gerando explicação ${i + 1}/${questionsWithAnswer.length} (Questão ${q.numero})...`,
              current: i + 1,
              total: questionsWithAnswer.length,
            });

            try {
              const explicacao = await generateExplanation(
                q.enunciado,
                q.alternativas,
                q.resposta_correta!
              );

              // Update the question in the database
              await supabase
                .from('questions')
                .update({ explicacao })
                .eq('id', questionId);
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Unknown error';
              send('progress', {
                message: `Erro na questão ${q.numero}: ${message}. Continuando...`,
              });
            }

            // Rate limit: 1s pause every 5 requests
            if ((i + 1) % 5 === 0 && i + 1 < questionsWithAnswer.length) {
              await new Promise((r) => setTimeout(r, 1000));
            }
          }
        }

        // 7. Done!
        send('complete', {
          message: 'Importação concluída!',
          examSlug,
          examName: exam.nome,
          totalQuestions: insertedQuestions.length,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unexpected error';
        controller.enqueue(encoder.encode(sseEvent('error', { message })));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
