/**
 * Instead of extracting raw image data (which pdfjs may decode poorly),
 * render the FULL PAGE at high resolution using pdfjs + node-canvas,
 * then CROP just the image region.
 */
import * as fs from 'fs';
import * as path from 'path';
import { createCanvas } from 'canvas';

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const buf = fs.readFileSync('C:/Users/usuario/Downloads/REVALIDA INEP 2022 2 OBJETIVA.pdf');

  const outDir = path.resolve('public/exam-images/test-render');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // NodeCanvasFactory for pdfjs
  class NodeCanvasFactory {
    create(width: number, height: number) {
      const canvas = createCanvas(width, height);
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

  // Render page 1 at 3x scale
  const SCALE = 3;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: SCALE });

  console.log(`Rendering page 1 at ${viewport.width}x${viewport.height} (${SCALE}x)`);

  const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

  try {
    await page.render({
      canvasContext: context as any,
      viewport,
      canvasFactory,
    }).promise;

    // Save full page for reference
    fs.writeFileSync(path.join(outDir, 'page1_full.png'), (canvas as any).toBuffer('image/png'));
    console.log('✓ Full page saved');

    // Now find the ECG image position from operator list
    const opList = await page.getOperatorList();
    for (let i = 0; i < opList.fnArray.length; i++) {
      if (opList.fnArray[i] !== pdfjsLib.OPS.paintImageXObject) continue;
      const imgName = opList.argsArray[i][0];

      // Skip watermarks
      if (imgName.includes('g_d0')) continue;

      // Get transform
      let transform = [1, 0, 0, 1, 0, 0];
      for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
        if (opList.fnArray[j] === pdfjsLib.OPS.transform) {
          transform = opList.argsArray[j];
          break;
        }
      }

      // PDF coordinates (bottom-left origin) → canvas coordinates (top-left origin)
      const pdfX = transform[4];
      const pdfY = transform[5];
      const pdfW = Math.abs(transform[0]);
      const pdfH = Math.abs(transform[3]);

      // Convert to canvas pixels (scaled)
      const canvasX = Math.round(pdfX * SCALE);
      const canvasY = Math.round((viewport.height / SCALE - pdfY - pdfH) * SCALE);
      const canvasW = Math.round(pdfW * SCALE);
      const canvasH = Math.round(pdfH * SCALE);

      console.log(`\nImage "${imgName}":`);
      console.log(`  PDF: x=${pdfX}, y=${pdfY}, w=${pdfW}, h=${pdfH}`);
      console.log(`  Canvas: x=${canvasX}, y=${canvasY}, w=${canvasW}, h=${canvasH}`);

      // Crop the image region from the rendered page
      if (canvasW > 100 && canvasH > 100) {
        const cropCanvas = createCanvas(canvasW, canvasH);
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(canvas as any, canvasX, canvasY, canvasW, canvasH, 0, 0, canvasW, canvasH);

        const filename = `crop_${imgName.replace(/[^a-zA-Z0-9]/g, '_')}_${canvasW}x${canvasH}.png`;
        fs.writeFileSync(path.join(outDir, filename), cropCanvas.toBuffer('image/png'));
        console.log(`  ✓ Cropped: ${filename}`);
      }
    }
  } catch (e: any) {
    console.error('Render error:', e.message?.substring(0, 100));
  }

  page.cleanup();
  await doc.destroy();
}
main().catch(e => console.error('Fatal:', e));
