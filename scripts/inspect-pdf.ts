/**
 * Inspect a PDF to understand its text structure using pdfjs-dist directly.
 */
import '../lib/pdf/canvas-polyfill';
import * as fs from 'fs';

async function main() {
  const pdfPath = process.argv[2] || 'C:/Users/usuario/Downloads/FAMERP 2020.pdf';
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const buf = fs.readFileSync(pdfPath);

  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  console.log(`Pages: ${doc.numPages}`);

  let fullText = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const pageText = (tc.items as any[]).map((i: any) => i.str).join(' ');
    fullText += `\n--- PAGE ${p} ---\n${pageText}`;
    page.cleanup();
  }

  console.log('\n=== First 4000 chars ===\n');
  console.log(fullText.substring(0, 4000));
  console.log('\n=== Chars 4000-8000 ===\n');
  console.log(fullText.substring(4000, 8000));
  console.log('\n=== Last 2000 chars (gabarito?) ===\n');
  console.log(fullText.substring(fullText.length - 2000));

  await doc.destroy();
}

main().catch((e) => console.error('Fatal:', e));
