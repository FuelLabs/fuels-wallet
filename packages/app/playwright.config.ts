import {
  type PlaywrightTestConfig,
  defineConfig,
  devices,
} from '@playwright/test';
import './load.envs.cts';

const PORT = process.env.PORT;
const IS_CI = process.env.CI;

export const playwrightConfig: PlaywrightTestConfig = {
  workers: 1,
  retries: IS_CI ? 1 : 0,
  testMatch: [
    'playwright/e2e/SendTransaction.test.ts',
    'playwright/crx/crx.test.ts',
    'playwright/**/*.test.ts',
  ],
  testDir: 'playwright/',
  outputDir: 'playwright-results/',
  // stop on first failure
  maxFailures: IS_CI ? 2 : undefined,
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
  projects: [
    {
      name: 'Chrome Prod',
      use: {
        channel: 'chrome',
        ...devices['Desktop Chrome'],
      },
    },
    {
      // For Google Chrome, Microsoft Edge and other Chromium-based browsers, by default,
      // Playwright uses open source Chromium builds.
      // Since the Chromium project is ahead of the branded browsers,
      // when the world is on Google Chrome N, Playwright already supports Chromium N+1 t
      // hat will be released in Google Chrome and Microsoft Edge a few weeks later.
      name: 'Chrome Beta (Chromium)',
      use: {
        channel: 'chromium',
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-features=ExtensionDisableUnsupportedDeveloper'],
        },
      },
    },
  ],
  testIgnore: ['playwright/crx/lock.test.ts', 'playwright/crx/assets.test.ts'],
};

export default defineConfig(playwrightConfig);
