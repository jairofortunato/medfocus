/**
 * Render PDF pages using Puppeteer (Chrome headless).
 * Chrome's built-in PDF renderer gives perfect quality output.
 *
 * Usage: npx tsx scripts/test-render-puppeteer.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

async function main() {
  const pdfPath = path.resolve('C:/Users/usuario/Downloads/REVALIDA INEP 2022 2 OBJETIVA.pdf');
  const outDir = path.resolve('public/exam-images/test-puppeteer');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // High resolution viewport (2x for retina-like quality)
  const SCALE = 2;
  await page.setViewport({ width: 1200, height: 1700, deviceScaleFactor: SCALE });

  // Load PDF via file:// URL
  const fileUrl = `file:///${pdfPath.replace(/\\/g, '/')}`;
  console.log(`Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for Chrome PDF viewer to render
  await new Promise((r) => setTimeout(r, 3000));

  // Screenshot the first page
  const screenshotPath = path.join(outDir, 'page1_chrome.png');
  await page.screenshot({
    path: screenshotPath,
    fullPage: false, // Just viewport (first page)
    type: 'png',
  });

  const stats = fs.statSync(screenshotPath);
  console.log(`✓ Page 1 screenshot: ${screenshotPath} (${(stats.size / 1024).toFixed(0)} KB)`);

  await browser.close();
  console.log('Done!');
}

main().catch(e => console.error('Fatal:', e));
