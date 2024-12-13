import { defineConfig } from '@playwright/test';
import './load.envs.cts';
const PORT = process.env.PORT || 3000;
const IS_CI = process.env.CI;

export default defineConfig({
  workers: 2,
  retries: IS_CI ? 1 : 0,
  testMatch: 'playwright/**/*.test.ts',
  testDir: 'playwright/',
  outputDir: 'playwright-results/',
  maxFailures: IS_CI ? 2 : undefined,
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: './playwright-html/' }],
  ],
  webServer: {
    command: 'NODE_ENV=test pnpm -w run dev:crx',
    reuseExistingServer: true,
    timeout: 20000,
    url: `http://localhost:${PORT}`,
  },
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: 'on-first-retry',
    actionTimeout: 5000,
    permissions: ['clipboard-read', 'clipboard-write'],
    screenshot: 'only-on-failure',
    headless: false,
  },
});
