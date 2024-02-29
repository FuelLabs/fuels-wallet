import { test as testConfig } from '@fuels/playwright-utils';
import { join } from 'path';

testConfig.use({
  pathToExtension: join(__dirname, '../../../app/dist-crx'),
});

export const test = testConfig;
