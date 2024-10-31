import {
  type PlaywrightTestConfig,
  defineConfig,
  devices,
} from '@playwright/test';
import './load.envs';

const IS_CI = process.env.CI;

const config: PlaywrightTestConfig = defineConfig({
  testDir: './playwright',
  retries: 1,
  maxFailures: IS_CI ? 1 : undefined,
  workers: 1,
  timeout: 60_000,
  reporter: [['html', { printSteps: true }]],
  webServer: {
    command: `pnpm dev:e2e-contracts --port ${process.env.PORT}`,
    port: Number(process.env.PORT),
    reuseExistingServer: true,
    timeout: 20000,
  },
  use: {
    baseURL: `http://localhost:${process.env.PORT}`,
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

export default config;
