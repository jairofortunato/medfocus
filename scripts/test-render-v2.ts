/**
 * Test: Render PDF page 1 at high resolution using pdfjs-dist + node-canvas.
 * This approach renders the FULL page (including all images) as the PDF viewer would show it,
 * giving much better image quality than extracting raw image objects.
 */
import * as fs from 'fs';
import * as path from 'path';
import { createCanvas, Image } from 'canvas';

// Polyfill DOMMatrix for pdfjs
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    m11 = 1; m12 = 0; m13 = 0; m14 = 0;
    m21 = 0; m22 = 1; m23 = 0; m24 = 0;
    m31 = 0; m32 = 0; m33 = 1; m34 = 0;
    m41 = 0; m42 = 0; m43 = 0; m44 = 1;
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    is2D = true; isIdentity = true;
    constructor(init?: any) {
      if (Array.isArray(init) && init.length === 6) {
        [this.a, this.b, this.c, this.d, this.e, this.f] = init;
        this.m11 = this.a; this.m12 = this.b;
        this.m21 = this.c; this.m22 = this.d;
        this.m41 = this.e; this.m42 = this.f;
      }
    }
    inverse() { return new DOMMatrix(); }
    multiply() { return new DOMMatrix(); }
    translate() { return new DOMMatrix(); }
    scale() { return new DOMMatrix(); }
    rotate() { return new DOMMatrix(); }
    transformPoint(p: any) { return p || { x: 0, y: 0 }; }
  } as any;
}

if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = class Path2D {
    constructor(_?: any) {}
    addPath() {} closePath() {} moveTo() {} lineTo() {}
    bezierCurveTo() {} quadraticCurveTo() {} arc() {} arcTo() {} rect() {}
  } as any;
}

if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    constructor(dataOrW: any, wOrH?: number, h?: number) {
      if (dataOrW instanceof Uint8ClampedArray) {
        this.data = dataOrW;
        this.width = wOrH!;
        this.height = h!;
      } else {
        this.width = dataOrW;
        this.height = wOrH!;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
      }
    }
  } as any;
}

// NodeCanvasFactory that pdfjs can use
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

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const pdfPath = 'C:/Users/usuario/Downloads/REVALIDA INEP 2022 2 OBJETIVA.pdf';
  const buf = fs.readFileSync(pdfPath);

  const outDir = path.resolve('public/exam-images/test-render-v2');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const canvasFactory = new NodeCanvasFactory();

  // Override pdfjs image handling to use node-canvas Image
  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buf),
    useSystemFonts: true,
    disableFontFace: true,
    canvasFactory: canvasFactory as any,
    isOffscreenCanvasSupported: false,
  }).promise;

  console.log(`PDF loaded: ${doc.numPages} pages`);

  const SCALE = 3; // 3x = ~216 DPI (72*3)
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: SCALE });

  console.log(`Rendering page 1 at ${Math.round(viewport.width)}x${Math.round(viewport.height)}`);

  const canvasAndCtx = canvasFactory.create(Math.round(viewport.width), Math.round(viewport.height));

  try {
    await page.render({
      canvasContext: canvasAndCtx.context as any,
      viewport,
    }).promise;

    const pngBuf = (canvasAndCtx.canvas as any).toBuffer('image/png');
    const fullPath = path.join(outDir, 'page1_full.png');
    fs.writeFileSync(fullPath, pngBuf);
    console.log(`✓ Full page saved: ${fullPath} (${(pngBuf.length / 1024).toFixed(0)} KB)`);

  } catch (e: any) {
    console.error('Render failed:', e.message);
    console.log('\nTrying alternative: extract raw image data directly...');

    // Fallback: Extract image objects from the page using getOperatorList
    const opList = await page.getOperatorList();
    const OPS = pdfjsLib.OPS;

    for (let i = 0; i < opList.fnArray.length; i++) {
      const fn = opList.fnArray[i];
      if (fn !== OPS.paintImageXObject && fn !== (OPS as any).paintJpegXObject) continue;

      const imgName = opList.argsArray[i][0];
      console.log(`Found image object: ${imgName}`);

      try {
        const imgData: any = await new Promise((resolve, reject) => {
          page.objs.get(imgName, (obj: any) => {
            if (obj) resolve(obj);
            else reject(new Error(`Image object ${imgName} not available`));
          });
        });

        const w = imgData.width;
        const h = imgData.height;
        console.log(`  Size: ${w}x${h}, kind: ${imgData.kind}, data: ${imgData.data?.length} bytes`);

        if (w < 100 || h < 100) {
          console.log('  Skipped (too small)');
          continue;
        }

        // Create canvas and put image data
        const imgCanvas = createCanvas(w, h);
        const imgCtx = imgCanvas.getContext('2d');

        // Handle different image kinds
        if (imgData.kind === 1) {
          // RGBA
          const id = imgCtx.createImageData(w, h);
          id.data.set(imgData.data);
          imgCtx.putImageData(id, 0, 0);
        } else if (imgData.kind === 2) {
          // RGB - need to convert to RGBA
          const rgbaData = new Uint8ClampedArray(w * h * 4);
          const src = imgData.data;
          for (let p = 0, s = 0; p < rgbaData.length; p += 4, s += 3) {
            rgbaData[p] = src[s];
            rgbaData[p + 1] = src[s + 1];
            rgbaData[p + 2] = src[s + 2];
            rgbaData[p + 3] = 255;
          }
          const id = imgCtx.createImageData(w, h);
          id.data.set(rgbaData);
          imgCtx.putImageData(id, 0, 0);
        } else if (imgData.kind === 3) {
          // Grayscale
          const rgbaData = new Uint8ClampedArray(w * h * 4);
          for (let p = 0; p < imgData.data.length; p++) {
            const v = imgData.data[p];
            rgbaData[p * 4] = v;
            rgbaData[p * 4 + 1] = v;
            rgbaData[p * 4 + 2] = v;
            rgbaData[p * 4 + 3] = 255;
          }
          const id = imgCtx.createImageData(w, h);
          id.data.set(rgbaData);
          imgCtx.putImageData(id, 0, 0);
        } else if (imgData.bitmap) {
          // ImageBitmap-like (node-canvas Image)
          imgCtx.drawImage(imgData.bitmap, 0, 0);
        } else {
          console.log(`  Unknown image kind: ${imgData.kind}`);
          continue;
        }

        const filename = `img_${imgName.replace(/[^a-zA-Z0-9]/g, '_')}_${w}x${h}.png`;
        fs.writeFileSync(path.join(outDir, filename), imgCanvas.toBuffer('image/png'));
        console.log(`  ✓ Saved: ${filename}`);
      } catch (imgErr: any) {
        console.log(`  ✗ ${imgErr.message}`);
      }
    }
  }

  page.cleanup();
  await doc.destroy();
  console.log('\nDone!');
}

main().catch(e => console.error('Fatal:', e));
