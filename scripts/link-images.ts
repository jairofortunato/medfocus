/**
 * Link extracted images (from public/exam-images/<slug>/) to questions in Supabase.
 *
 * Usage: npx tsx scripts/link-images.ts <slug>
 *
 * Reads filenames like q1_p1_400x226.png, parses question number,
 * looks up question_id from the DB, and upserts into question_images.
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env.local') });

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: npx tsx scripts/link-images.ts <slug>');
    process.exit(1);
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Get exam
  const { data: exam, error: examErr } = await sb.from('exams').select('id').eq('slug', slug).single();
  if (examErr || !exam) { console.error('Exam not found:', slug); process.exit(1); }

  // Get all questions for this exam
  const { data: questions } = await sb.from('questions').select('id, numero').eq('exam_id', exam.id);
  const qLookup: Record<number, string> = {};
  (questions ?? []).forEach((q: any) => { qLookup[q.numero] = q.id; });

  // Read image files
  const imgDir = path.resolve('public', 'exam-images', slug);
  if (!fs.existsSync(imgDir)) { console.error('No image dir:', imgDir); process.exit(1); }

  const files = fs.readdirSync(imgDir).filter((f) => f.endsWith('.png'));
  console.log(`Found ${files.length} images in ${imgDir}`);

  let linked = 0;
  let skipped = 0;

  for (const file of files) {
    // Parse: q{num}_p{page}_{w}x{h}.png
    const match = file.match(/^q(\d+)_p(\d+)_(\d+)x(\d+)\.png$/);
    if (!match) { console.log(`  Skip (bad name): ${file}`); skipped++; continue; }

    const qNum = parseInt(match[1]);
    const pageNum = parseInt(match[2]);

    if (qNum === 0) { console.log(`  Skip (Q0 unmapped): ${file}`); skipped++; continue; }

    const questionId = qLookup[qNum];
    if (!questionId) { console.log(`  Skip (Q${qNum} not in DB): ${file}`); skipped++; continue; }

    const imageUrl = `/exam-images/${slug}/${file}`;

    const { error } = await sb.from('question_images').upsert({
      question_id: questionId,
      image_url: imageUrl,
      image_type: 'figure',
      display_order: 0,
      page_number: pageNum,
    }, { onConflict: 'question_id,image_url', ignoreDuplicates: false });

    if (error) {
      console.log(`  ✗ Q${qNum}: ${error.message}`);
    } else {
      console.log(`  ✓ Q${qNum} → ${imageUrl}`);
      linked++;
    }
  }

  console.log(`\nDone: ${linked} linked, ${skipped} skipped`);
}

main().catch((e) => console.error('Fatal:', e));
