/**
 * Applies the topicos column migration directly via Supabase service role.
 * Run once: npx tsx scripts/run-migration-topicos.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('Applying topicos migration...');

  // Check if column already exists
  const { data: check } = await supabase
    .from('questions')
    .select('topicos')
    .limit(1);

  if (check !== null) {
    console.log('✓ Column topicos already exists');
    return;
  }

  // Apply via pg_net or direct SQL — use the REST endpoint
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    },
    body: JSON.stringify({
      sql: `
        ALTER TABLE questions ADD COLUMN IF NOT EXISTS topicos jsonb DEFAULT '[]'::jsonb;
        CREATE INDEX IF NOT EXISTS idx_questions_topicos ON questions USING GIN (topicos);
      `
    }),
  });

  if (response.ok) {
    console.log('✓ Migration applied');
  } else {
    const body = await response.text();
    console.log('Response:', body);
    console.log('\nPlease run this SQL manually in your Supabase SQL Editor:');
    console.log(`
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS topicos jsonb DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_questions_topicos
  ON questions USING GIN (topicos);
    `);
  }
}

main().catch(console.error);
