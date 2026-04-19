/**
 * Render PDF pages in a headless browser using pdf.js,
 * then crop image regions. This gives pixel-perfect rendering.
 */
import * as fs from 'fs';
import * as path from 'path';
import { createCanvas } from 'canvas';

// Strategy: use pdf.js to get image positions, then use
// a different approach - convert PDF page to image using
// the `pdf-poppler` or `sharp` approach.
// Actually, let's try: render using canvas with proper Image polyfill.

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const canvasModule = await import('canvas');
  const { createCanvas: cc, Image } = canvasModule;

  const buf = fs.readFileSync('C:/Users/usuario/Downloads/REVALIDA INEP 2022 2 OBJETIVA.pdf');
  const outDir = path.resolve('public/exam-images/test-render');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Patch global to provide Image constructor that node-canvas uses
  (globalThis as any).Image = Image;

  class NodeCanvasFactory {
    create(width: number, height: number) {
      const canvas = cc(width, height);
      const context = canvas.getContext('2d');
      return { canvas, context };
    }
    reset(canvasAndContext: any, width: number, height: number) {
      canvasAndContext.canvas.width = width;
      canvasAndContext.canvas.height = height;
    }
    destroy(canvasAndContext: any) {
      canvasAndContext.canvas.width = 0;
      canvasAndContext.canvas.height = 0;
    }
  }

  const canvasFactory = new NodeCanvasFactory();

  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableFontFace: true,
    canvasFactory,
  }).promise;

  const SCALE = 3;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: SCALE });

  console.log(`Page 1: ${viewport.width}x${viewport.height} at ${SCALE}x`);

  const canvas = cc(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  // Fill white background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, viewport.width, viewport.height);

  try {
    await page.render({
      canvasContext: context as any,
      viewport,
      canvasFactory,
    }).promise;

    fs.writeFileSync(path.join(outDir, 'page1_rendered.png'), canvas.toBuffer('image/png'));
    console.log('✓ Page rendered successfully!');
  } catch (e: any) {
    console.log('Render failed:', e.message?.substring(0, 120));

    // Even if render partially fails, save what we got
    fs.writeFileSync(path.join(outDir, 'page1_partial.png'), canvas.toBuffer('image/png'));
    console.log('✓ Partial render saved');
  }

  page.cleanup();
  await doc.destroy();
}
main().catch(e => console.error('Fatal:', e));
