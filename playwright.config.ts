import { defineConfig } from '@playwright/test';

const defaultPort = '42741';
const defaultBaseUrl = `http://127.0.0.1:${defaultPort}`;
const webServerCommand =
  process.platform === 'win32'
    ? `node scripts/serve-dist.mjs ${defaultPort}`
    : `node scripts/serve-dist.mjs ${defaultPort}`;
const useExternalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  reporter: 'line',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? defaultBaseUrl,
    headless: true,
  },
  ...(useExternalServer
    ? {}
    : {
        webServer: {
          command: webServerCommand,
          url: defaultBaseUrl,
          reuseExistingServer: false,
          timeout: 120_000,
        },
      }),
});
