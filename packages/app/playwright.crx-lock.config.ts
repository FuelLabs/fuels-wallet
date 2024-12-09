// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import { defineConfig } from '@playwright/test';
import './load.envs';
import { playwrightConfig } from './playwright.config';

const IS_CI = process.env.CI;

export default defineConfig({
  ...playwrightConfig,
  retries: IS_CI ? 1 : 0,
  maxFailures: IS_CI ? 2 : undefined,
  testMatch: join(__dirname, './playwright/crx/lock.test.ts'),
  testIgnore: undefined,
});
