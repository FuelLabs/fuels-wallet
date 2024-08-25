// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { join } from 'path';
import { defineConfig } from '@playwright/test';
import { playwrightConfig } from './playwright.config';

export default defineConfig({
  ...playwrightConfig,
  testMatch: join(__dirname, './playwright/crx/lock.test.ts'),
  testIgnore: undefined,
});
