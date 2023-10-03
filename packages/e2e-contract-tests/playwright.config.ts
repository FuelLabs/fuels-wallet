import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';
import './load.envs';

const config: PlaywrightTestConfig = defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  webServer: {
    command: `pnpm dev:e2e-contracts --mode test --port ${process.env.PORT}`,
    port: Number(process.env.PORT),
    reuseExistingServer: false,
  },
  use: {
    baseURL: `http://localhost:${process.env.PORT}`,
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on-first-retry',
    // headless: ?
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

export default config;
