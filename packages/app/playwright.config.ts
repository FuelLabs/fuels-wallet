// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import {
  type PlaywrightTestConfig,
  defineConfig,
  devices,
} from '@playwright/test';
import './load.envs';

const PORT = process.env.PORT;
const IS_CI = process.env.CI;

export const playwrightConfig: PlaywrightTestConfig = {
  workers: 1,
  retries: IS_CI ? 1 : 0,
  testMatch: join(__dirname, './playwright/**/*.test.ts'),
  testDir: join(__dirname, './playwright/'),
  outputDir: join(__dirname, './playwright-results/'),
  // stop on first failure
  maxFailures: IS_CI ? 2 : undefined,
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
    trace: 'on-first-retry',
    actionTimeout: 5000,
    screenshot: 'only-on-failure',
    headless: false,
  },
  // ignore lock test because it takes too long and it will be tested in a separate config
  testIgnore: [join(__dirname, './playwright/crx/lock.test.ts')],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chromium'],
      },
    },
    {
      name: 'chrome-beta',
      use: {
        channel: 'chrome-beta',
        ...devices['Desktop Chrome'],
      },
      testIgnore: [
        join(__dirname, './playwright/crx/crx.test.ts'),
        join(__dirname, './playwright/crx/lock.test.ts'),
      ],
    },
  ],
};

export default defineConfig(playwrightConfig);
