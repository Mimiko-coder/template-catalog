import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templates = [
  'minimalist',
  'corporate',
  'transportation',
  'dark-premium',
  'creative',
  'industrial',
  'luxury',
  'startup',
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const name of templates) {
  const url = `file:///${path.join(__dirname, name, 'index.html').replace(/\\/g, '/')}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const out = path.join(__dirname, name, 'preview.png');
  await page.screenshot({ path: out, fullPage: false });
  console.log(`Captured ${name}/preview.png`);
}

await browser.close();
