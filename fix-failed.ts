import { createClient } from '@supabase/supabase-js';
import { Database } from './lib/supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

async function fixFailedQuestion() {
  const questionId = 'f55c9042-08b2-4900-a4ec-ef6eab57df25';
  
  // Anesthesiology usually falls under Surgery ("Cirurgia") if it's the closest fit in the 21 areas.
  const { error } = await supabase
    .from('questions')
    .update({ area: 'Cirurgia' })
    .eq('id', questionId);

  if (error) {
    console.error('Failed to update question:', error);
  } else {
    console.log('Successfully fixed question 82 (Anesthesiology -> Cirurgia).');
  }
}

fixFailedQuestion();
