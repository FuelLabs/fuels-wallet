import {
  type PlaywrightTestConfig,
  defineConfig,
  devices,
} from '@playwright/test';
import './load.envs';

const config: PlaywrightTestConfig = defineConfig({
  testDir: './playwright',
  retries: 1,
  workers: 1,
  timeout: 60_000,
  reporter: [['html', { printSteps: true }]],
  webServer: {
    command: `pnpm dev:e2e-contracts --port ${process.env.PORT}`,
    port: Number(process.env.PORT),
    reuseExistingServer: true,
  },
  use: {
    baseURL: `http://localhost:${process.env.PORT}`,
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

export default config;
