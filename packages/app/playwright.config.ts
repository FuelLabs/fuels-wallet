import { defineConfig } from '@playwright/test';
import { join } from 'path';
import './load.envs';

const distDirectory = join(__dirname, './dist');

const IS_CI = !!process.env.CI;
const PORT = process.env.PORT;

export default defineConfig({
  workers: 1,
  testMatch: join(__dirname, './playwright/**/*.test.ts'),
  testDir: join(__dirname, './playwright/'),
  outputDir: join(__dirname, './playwright-results/traces/'),
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: join(__dirname, './playwright-results/html/') }],
  ],
  // Retry tests on CI if they fail
  retries: IS_CI ? 2 : 0,
  webServer: {
    command: `pnpm exec http-server -s -p ${PORT} ${distDirectory}`,
    port: Number(PORT),
    reuseExistingServer: true,
  },
  use: {
    baseURL: `http://localhost:${PORT}/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    headless: true,
    trace: 'on-first-retry',
  },
});
