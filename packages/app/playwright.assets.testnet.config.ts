import { defineConfig, devices } from '@playwright/test';
import { playwrightConfig } from './playwright.config';
import './load.envs.cts';

export default defineConfig({
  ...playwrightConfig,
  testMatch: 'playwright/crx/assets.testnet.test.ts',
  testIgnore: undefined,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chromium'],
      },
    },
  ],
});
