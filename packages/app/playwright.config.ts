import { join } from 'node:path';
import { type PlaywrightTestConfig, defineConfig } from '@playwright/test';
import './load.envs.cts';

const PORT = process.env.PORT || 3000;

export const playwrightConfig: PlaywrightTestConfig = {
  workers: 1,
  testMatch: 'playwright/**/*.test.ts',
  testDir: 'playwright/',
  outputDir: 'playwright-results/',
  // stop on first failure
  maxFailures: 1,
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: './playwright-html/' }],
  ],
  webServer: {
    command: 'NODE_ENV=test pnpm dev:crx',
    reuseExistingServer: true,
    port: Number(PORT),
    timeout: 20000,
  },
  use: {
    baseURL: `http://localhost:${PORT}/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    headless: false,
    trace: 'on-first-retry',
    actionTimeout: 5000,
  },
  // ignore lock test because it takes too long and it will be tested in a separate config
  testIgnore: ['playwright/crx/lock.test.ts'],
};

export default defineConfig(playwrightConfig);
