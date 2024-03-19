import { join } from 'node:path';
import { test as testConfig } from '@fuels/playwright-utils';

testConfig.use({
  pathToExtension: join(__dirname, '../../../app/dist-crx'),
});

export const test = testConfig;
