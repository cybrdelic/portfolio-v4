import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 45_000, workers: 1, fullyParallel: false,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4186', viewport: { width: 1440, height: 960 },
    headless: true, screenshot: 'only-on-failure',
    launchOptions: { args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.006, animations: 'disabled' } },
  webServer: { command: 'node scripts/test-server.mjs', url: 'http://127.0.0.1:4186', reuseExistingServer: !process.env.CI },
});
