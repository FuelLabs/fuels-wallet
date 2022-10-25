import type { PlaywrightTestConfig } from '@playwright/test';
import { join } from 'path';
import './load.envs';

const { E2E_PORT = 9000 } = process.env;
const distDirectory = join(__dirname, './dist');

const config: PlaywrightTestConfig = {
  testMatch: join(__dirname, './playwright/**/*.test.ts'),
  testDir: join(__dirname, './playwright/'),
  webServer: {
    command: `pnpm exec http-server -s -p ${E2E_PORT} ${distDirectory}`,
    port: Number(E2E_PORT),
    reuseExistingServer: false,
  },
  use: {
    baseURL: `http://localhost:${E2E_PORT}/`,
    permissions: ['clipboard-read', 'clipboard-write'],
    headless: false,
  },
};

export default config;
