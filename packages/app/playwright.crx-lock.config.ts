import { defineConfig, devices } from '@playwright/test';
import { playwrightConfig } from './playwright.config';
import './load.envs.cts';

export default defineConfig({
  ...playwrightConfig,
  testMatch: 'playwright/crx/lock.test.ts',
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
