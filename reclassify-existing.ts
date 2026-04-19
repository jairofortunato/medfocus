import { createClient } from '@supabase/supabase-js';
import { generateExplanation } from './lib/ai/openai';
import { Database } from './lib/supabase/types';
import { MEDICAL_AREAS, MedicalArea } from './lib/config/medical-areas';

// Run with: npx tsx --env-file=.env.local reclassify-existing.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

async function reclassify() {
    console.log('Starting Batch Reclassification...');

    // 1. Fetch all questions
    const { data: questions, error } = await supabase
        .from('questions')
        .select('*');

    if (error) {
        console.error('Error fetching questions:', error);
        process.exit(1);
    }

    console.log(`Found ${questions.length} questions to reclassify.`);

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        console.log(`[${i + 1}/${questions.length}] Reclassifying question ${q.id} (Numero: ${q.numero})...`);

        const alternativas: Record<string, string> = {
            A: q.alternativa_a,
            B: q.alternativa_b,
            C: q.alternativa_c,
            D: q.alternativa_d,
            E: q.alternativa_e,
        };

        try {
            // 2. Call AI classification
            const result = await generateExplanation(
                q.enunciado,
                alternativas,
                q.resposta_correta
            );

            console.log(`   - New Area: ${result.area}`);

            // 3. Update question
            const { error: updateError } = await supabase
                .from('questions')
                .update({
                    area: result.area,
                    explicacao: result.explicacao,
                })
                .eq('id', q.id);

            if (updateError) {
                console.error(`   ❌ Error updating question ${q.id}:`, updateError);
            } else {
                console.log(`   ✅ Updated successfully.`);
            }

            // Small delay to avoid heavy rate limits if many questions
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (err) {
            console.error(`   ❌ Failed to reclassify question ${q.id}:`, err);
        }
    }

    console.log('Batch Reclassification Completed!');
}

reclassify();
