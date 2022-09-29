import type { PlaywrightTestConfig } from '@playwright/test';
import { join } from 'path';

const config: PlaywrightTestConfig = {
  testMatch: join(__dirname, './packages/app/playwright/**/*.test.ts'),
  testDir: join(__dirname, './packages/app/playwright/'),
};

export default config;
