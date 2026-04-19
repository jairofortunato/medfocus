/**
 * Extracts content images from PDF files, automatically skipping watermarks.
 *
 * Strategy:
 * 1. First pass (fast): count how many pages each image NAME appears on (no data access)
 * 2. Images on >40% of pages = watermark → skip
 * 3. Second pass: extract remaining images at native resolution
 * 4. Map each image to the nearest question above it by Y-position
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ExtractedImage {
  questionNumber: number;
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
}

function getImageData(page: any, imgName: string, timeoutMs = 5000): Promise<any> {
  return Promise.race([
    new Promise<any>((resolve) => {
      page.objs.get(imgName, (obj: any) => resolve(obj ?? null));
    }),
    new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout getting ${imgName}`)), timeoutMs)
    ),
  ]);
}

export async function extractPdfImages(
  pdfBuffer: Buffer,
  examSlug: string,
): Promise<ExtractedImage[]> {
  const { createCanvas } = await import('canvas');
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const outputDir = path.resolve('public', 'exam-images', examSlug);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  const totalPages = doc.numPages;

  // --- Pass 1 (fast): count image name occurrences across pages ---
  const namePageCount: Record<string, number> = {};

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const opList = await page.getOperatorList();
    const seen = new Set<string>();

    for (let i = 0; i < opList.fnArray.length; i++) {
      if (opList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
        const name = opList.argsArray[i][0];
        if (!seen.has(name)) {
          seen.add(name);
          namePageCount[name] = (namePageCount[name] || 0) + 1;
        }
      }
    }
    page.cleanup();
  }

  // Watermark threshold: appears on >40% of pages or >10 pages
  const threshold = Math.max(10, Math.ceil(totalPages * 0.4));
  const watermarkNames = new Set<string>();
  for (const [name, count] of Object.entries(namePageCount)) {
    if (count >= threshold) watermarkNames.add(name);
  }
  console.log(`  Watermarks: ${watermarkNames.size} image name(s) (threshold: ${threshold}+ pages)`);

  // --- Pass 2: extract content images ---
  const results: ExtractedImage[] = [];
  // Track extracted fingerprints to skip duplicate watermarks with different names
  const extractedFingerprints = new Set<string>();
  const watermarkFingerprints = new Set<string>();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const opList = await page.getOperatorList();
    const viewport = page.getViewport({ scale: 1 });

    // Find question labels on this page
    const textContent = await page.getTextContent();
    const questionPositions: { num: number; y: number }[] = [];
    for (const item of textContent.items as any[]) {
      const match = item.str?.match(/Quest[ãa]o\s+(\d+)/i);
      if (match) {
        const y = viewport.height - item.transform[5];
        questionPositions.push({ num: parseInt(match[1]), y });
      }
    }
    questionPositions.sort((a, b) => a.y - b.y);

    for (let i = 0; i < opList.fnArray.length; i++) {
      if (opList.fnArray[i] !== pdfjsLib.OPS.paintImageXObject) continue;
      const imgName = opList.argsArray[i][0];
      if (watermarkNames.has(imgName)) continue;

      // Get position from transform
      let transform = [1, 0, 0, 1, 0, 0];
      for (let j = i - 1; j >= Math.max(0, i - 20); j--) {
        if (opList.fnArray[j] === pdfjsLib.OPS.transform) {
          transform = opList.argsArray[j];
          break;
        }
      }
      const imgY = viewport.height - transform[5];

      // Map to nearest question above
      let bestQuestion = 0;
      for (const qp of questionPositions) {
        if (qp.y <= imgY) bestQuestion = qp.num;
        else break;
      }

      try {
        const imgData = await getImageData(page, imgName);
        if (!imgData?.data) continue;

        const w = imgData.width;
        const h = imgData.height;

        // Skip tiny images
        if (w < 80 || h < 60) continue;

        // Fingerprint to detect renamed watermarks
        const fp = `${w}x${h}_${imgData.data.length}`;
        if (watermarkFingerprints.has(fp)) continue;

        // If we've seen this exact fingerprint on a previous page and it was also on this page,
        // likely a watermark that got different names. Track it.
        if (extractedFingerprints.has(fp)) {
          watermarkFingerprints.add(fp);
          // Remove previously extracted image with this fingerprint
          const idx = results.findIndex(
            (r) => `${r.width}x${r.height}_${fs.statSync(path.resolve('public', r.imageUrl.slice(1))).size}` !== fp
          );
          continue;
        }
        extractedFingerprints.add(fp);

        const canvas = createCanvas(w, h);
        const ctx = canvas.getContext('2d');
        const imageDataObj = ctx.createImageData(w, h);

        if (imgData.kind === 2) {
          // RGB → RGBA
          const src = imgData.data;
          const dst = imageDataObj.data;
          for (let p = 0, s = 0; p < dst.length; p += 4, s += 3) {
            dst[p] = src[s];
            dst[p + 1] = src[s + 1];
            dst[p + 2] = src[s + 2];
            dst[p + 3] = 255;
          }
        } else if (imgData.kind === 1) {
          // Grayscale → RGBA
          const src = imgData.data;
          const dst = imageDataObj.data;
          for (let s = 0; s < src.length; s++) {
            dst[s * 4] = src[s];
            dst[s * 4 + 1] = src[s];
            dst[s * 4 + 2] = src[s];
            dst[s * 4 + 3] = 255;
          }
        } else if (imgData.data.length === w * h * 4) {
          // RGBA direct
          imageDataObj.data.set(imgData.data);
        } else {
          continue;
        }

        ctx.putImageData(imageDataObj, 0, 0);

        const fileName = `q${bestQuestion}_p${pageNum}_${w}x${h}.png`;
        fs.writeFileSync(path.join(outputDir, fileName), canvas.toBuffer('image/png'));

        results.push({
          questionNumber: bestQuestion,
          pageNumber: pageNum,
          imageUrl: `/exam-images/${examSlug}/${fileName}`,
          width: w,
          height: h,
        });

        process.stdout.write(`    Q${bestQuestion} (p${pageNum}): ${w}x${h}\n`);
      } catch (err: any) {
        // Timeout or extraction error — skip
      }
    }

    page.cleanup();
  }

  await doc.cleanup();
  await doc.destroy();

  return results;
}
