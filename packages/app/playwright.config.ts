// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import { defineConfig } from '@playwright/test';
import './load.envs';

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
  webServer: {
    command: 'NODE_ENV=test pnpm dev:crx',
    port: Number(PORT),
    reuseExistingServer: true,
    timeout: 20000,
  },
  use: {
    baseURL: `http://localhost:${PORT}/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    headless: false,
    trace: 'on-first-retry',
    actionTimeout: 5000,
  },
});
