import { expect, test } from '@playwright/test';
import {
  analyzeSnapshot,
  collectVisualSnapshot,
  routes,
  viewports,
} from '../scripts/visual-audit-core.mjs';

function formatIssues(route, viewport, issues) {
  return [
    `${route.name} @ ${viewport.label} (${viewport.width}x${viewport.height})`,
    ...issues.map((issue) => `- ${issue}`),
  ].join('\n');
}

for (const viewport of viewports) {
  for (const route of routes) {
    test(`${route.name} metric audit is clean at ${viewport.label}`, async ({ page, baseURL }) => {
      const snapshot = await collectVisualSnapshot(page, {
        baseUrl: baseURL,
        route,
        viewport,
      });
      const analysis = analyzeSnapshot(snapshot);
      expect(analysis.issues, formatIssues(route, viewport, analysis.issues)).toEqual([]);
    });

    test(`${route.name} screenshot matches baseline at ${viewport.label}`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => {
        sessionStorage.setItem('boot-sequence-seen', '1');
      });
      await page.goto(`${baseURL}${route.path}`, { waitUntil: 'networkidle' });

      await expect(page).toHaveScreenshot(`${route.name}-${viewport.label}.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixelRatio: 0.001,
        timeout: 120000,
      });
    });
  }
}