import '../lib/pdf/canvas-polyfill';
import * as fs from 'fs';
async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const buf = fs.readFileSync('C:/Users/usuario/Downloads/REVALIDA INEP 2022 2 OBJETIVA.pdf');
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf), useSystemFonts: true, disableFontFace: true }).promise;
  const pages = process.argv.slice(2).map(Number);
  for (const p of pages) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const vp = page.getViewport({ scale: 1 });
    console.log(`\n=== Page ${p} ===`);
    const qs: string[] = [];
    for (const item of tc.items as any[]) {
      const m = item.str?.match(/Quest[ãa]o\s+(\d+)/i);
      if (m) qs.push(`Q${m[1]} y=${(vp.height - item.transform[5]).toFixed(0)}`);
    }
    if (qs.length) qs.forEach(q => console.log('  ' + q));
    else {
      // Show some text for context
      const texts = (tc.items as any[]).filter(i => i.str?.trim().length > 5).slice(0, 10);
      texts.forEach(t => console.log(`  "${t.str.trim().substring(0, 100)}"`));
    }
    page.cleanup();
  }
  await doc.destroy();
}
main().catch(e => console.error(e));
