import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from '@playwright/test';

const timeline = [
  { label: '00-start', waitMs: 0 },
  { label: '01-logo-resolve', waitMs: 450 },
  { label: '02-split', waitMs: 250 },
  { label: '03-morph', waitMs: 850 },
  { label: '04-settle', waitMs: 250 },
  { label: '05-complete', waitMs: 800 },
] as const;

async function captureTimeline(page: import('@playwright/test').Page, prefix: string) {
  const outputDir = path.join(process.cwd(), 'output', 'playwright', 'hero');
  await fs.mkdir(outputDir, { recursive: true });

  await page.goto('/', { waitUntil: 'networkidle' });

  for (const frame of timeline) {
    if (frame.waitMs > 0) {
      await page.waitForTimeout(frame.waitMs);
    }

    await page.screenshot({
      fullPage: false,
      path: path.join(outputDir, `${prefix}-${frame.label}.png`),
    });
  }
}

test('capture desktop hero timeline', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await captureTimeline(page, 'desktop');
});

test('capture mobile hero timeline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await captureTimeline(page, 'mobile');
});
