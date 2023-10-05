import {
  type PlaywrightTestConfig,
  defineConfig,
  devices,
} from '@playwright/test';
import './load.envs';

const config: PlaywrightTestConfig = defineConfig({
  testDir: './playwright',
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  webServer: {
    command: `pnpm dev:e2e-contracts --mode test --port ${process.env.PORT}`,
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
