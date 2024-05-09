// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import { defineConfig } from '@playwright/test';
import './load.envs';

const IS_CI = !!process.env.CI;
const PORT = process.env.PORT;

export default defineConfig({
  workers: 1,
  testMatch: join(__dirname, './playwright/**/*.test.ts'),
  testDir: join(__dirname, './playwright/'),
  outputDir: join(__dirname, './playwright-results/'),
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: join(__dirname, './playwright-html/') }],
  ],
  // Retry tests on CI if they fail
  retries: IS_CI ? 2 : 0,
  webServer: {
    command: 'pnpm dev:crx',
    port: Number(PORT),
    reuseExistingServer: true,
  },
  use: {
    baseURL: `http://localhost:${PORT}/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    headless: false,
    trace: 'on-first-retry',
  },
});
