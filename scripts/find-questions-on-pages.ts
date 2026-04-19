/**
 * Find which questions appear on specific PDF pages.
 */
import '../lib/pdf/canvas-polyfill';
import * as fs from 'fs';

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const pdfPath = 'C:/Users/usuario/Downloads/REVALIDA INEP 2022 2 OBJETIVA.pdf';
  const buf = fs.readFileSync(pdfPath);

  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  for (const pageNum of [20, 42]) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1 });

    console.log(`\n=== Page ${pageNum} ===`);
    const questions: { num: number; y: number }[] = [];
    for (const item of textContent.items as any[]) {
      const match = item.str?.match(/Quest[ãa]o\s+(\d+)/i);
      if (match) {
        const y = viewport.height - item.transform[5];
        questions.push({ num: parseInt(match[1]), y });
      }
    }

    if (questions.length === 0) {
      console.log('  No "Questão X" labels found on this page');
      // Show first few text items to understand context
      const texts = (textContent.items as any[])
        .filter((it: any) => it.str?.trim().length > 3)
        .slice(0, 15)
        .map((it: any) => `  y=${(viewport.height - it.transform[5]).toFixed(0)}: "${it.str.trim().substring(0, 80)}"`);
      console.log('  First text items:');
      texts.forEach((t) => console.log(t));
    } else {
      questions.sort((a, b) => a.y - b.y);
      questions.forEach((q) => console.log(`  Questão ${q.num} at y=${q.y.toFixed(0)}`));
    }

    // Also check previous page for context
    if (pageNum > 1) {
      const prevPage = await doc.getPage(pageNum - 1);
      const prevText = await prevPage.getTextContent();
      const prevVp = prevPage.getViewport({ scale: 1 });
      const prevQs: number[] = [];
      for (const item of prevText.items as any[]) {
        const match = item.str?.match(/Quest[ãa]o\s+(\d+)/i);
        if (match) prevQs.push(parseInt(match[1]));
      }
      if (prevQs.length > 0) {
        console.log(`  (Previous page ${pageNum - 1} has: Q${prevQs.join(', Q')})`);
      }
      prevPage.cleanup();
    }

    page.cleanup();
  }

  await doc.destroy();
}

main().catch((e) => console.error('Fatal:', e));
