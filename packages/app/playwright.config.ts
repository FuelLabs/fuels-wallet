// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import { type PlaywrightTestConfig, defineConfig } from '@playwright/test';
import './load.envs';

const PORT = process.env.PORT;

export const playwrightConfig: PlaywrightTestConfig = {
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
  testIgnore: [join(__dirname, './playwright/crx/lock.test.ts')],
};

export default defineConfig(playwrightConfig);
