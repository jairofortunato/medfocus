/**
 * Test image extraction on a PDF.
 * Usage: npx tsx scripts/test-extract-images.ts "path/to/pdf" "slug"
 */
import '../lib/pdf/canvas-polyfill';
import * as fs from 'fs';
import { extractPdfImages } from '../lib/pdf/image-extractor';

async function main() {
  const pdfPath = process.argv[2] || 'C:/Users/usuario/Downloads/REVALIDA INEP 2022 2 OBJETIVA.pdf';
  const slug = process.argv[3] || 'revalida-inep-2022-test';

  console.log(`Extracting images from: ${pdfPath}`);
  console.log(`Output slug: ${slug}\n`);

  const buf = fs.readFileSync(pdfPath);
  const images = await extractPdfImages(Buffer.from(buf), slug);

  console.log(`\n=== Results: ${images.length} images ===`);
  images.forEach((img) => {
    console.log(`  Q${img.questionNumber} (p${img.pageNumber}): ${img.width}x${img.height} → ${img.imageUrl}`);
  });
}

main().catch((e) => console.error('Fatal:', e));
