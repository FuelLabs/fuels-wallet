// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import { defineConfig } from '@playwright/test';
import './load.envs';

const distDirectory = join(__dirname, './dist');

const _IS_CI = !!process.env.CI;
const PORT = process.env.PORT;

export default defineConfig({
  workers: 4,
  testMatch: join(__dirname, './playwright/**/*.test.ts'),
  testDir: join(__dirname, './playwright/'),
  outputDir: join(__dirname, './playwright-results/'),
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: join(__dirname, './playwright-html/') }],
  ],
  // Retry tests on CI if they fail
  retries: 4,
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
