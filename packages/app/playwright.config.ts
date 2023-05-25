import type { PlaywrightTestConfig } from '@playwright/test';
import { join } from 'path';
import './load.envs';

const distDirectory = join(__dirname, './dist');

const IS_CI = !!process.env.CI;
const PORT = process.env.PORT;

const config: PlaywrightTestConfig = {
  workers: 1,
  testMatch: join(__dirname, './playwright/**/*.test.ts'),
  testDir: join(__dirname, './playwright/'),
  reporter: [['list', { printSteps: true }]],
  // Retry tests on CI if they fail
  retries: IS_CI ? 2 : 0,
  webServer: {
    command: `pnpm exec http-server -s -p ${PORT} ${distDirectory}`,
    port: Number(PORT),
    reuseExistingServer: true,
  },
  use: {
    baseURL: `http://localhost:${PORT}/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    headless: true,
  },
};

export default config;
