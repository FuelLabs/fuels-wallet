import { join } from 'node:path';
import { test as testConfig } from '@fuels/playwright-utils';

// This must be called so that the local crx is used, otherwise a production build will be downloaded and used
// This must be called once for each test file
export function useLocalCRX() {
  testConfig.use({
    pathToExtension: join(__dirname, '../../../app/dist-crx'),
  });
}

export const test = testConfig;
