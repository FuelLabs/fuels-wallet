import { join } from 'node:path';
import { type PlaywrightTestConfig, defineConfig } from '@playwright/test';
import './load.envs.cts';

const PORT = process.env.PORT;
const IS_CI = process.env.CI;

export const playwrightConfig: PlaywrightTestConfig = {
  workers: 1,
  retries: IS_CI ? 1 : 0,
  testMatch: 'playwright/**/*.test.ts',
  testDir: 'playwright/',
  outputDir: 'playwright-results/',
  // stop on first failure
  maxFailures: IS_CI ? 1 : undefined,
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
    trace: 'on-first-retry',
    actionTimeout: 5000,
    screenshot: 'only-on-failure',
    headless: false,
  },
  // ignore lock test because it takes too long and it will be tested in a separate config
  testIgnore: ['playwright/crx/lock.test.ts'],
};

export default defineConfig(playwrightConfig);
