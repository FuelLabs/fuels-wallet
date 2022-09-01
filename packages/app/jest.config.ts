/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/order */
import type { Config } from '@jest/types';
// @ts-ignore
import baseConfig from '@fuel-ui/test-utils/config';

import './load.envs.js';
import pkg from './package.json';

const config: Config.InitialOptions = {
  ...baseConfig,
  rootDir: __dirname,
  displayName: pkg.name,
  setupFilesAfterEnv: [require.resolve('@fuel-ui/test-utils/setup')],
  setupFiles: ['./load.envs.js', 'fake-indexeddb/auto'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^dexie$': require.resolve('dexie'),
    /**
     * This is here because when using pnpm link with @fuel-ui packages,
     * two versions of react can cause runtime errors
     * */
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
  },
};

export default config;
