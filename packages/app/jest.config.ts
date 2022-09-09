/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/order */
import type { Config } from '@jest/types';
// @ts-ignore
import baseConfig from '@fuel-ui/test-utils/config';

import pkg from './package.json';
import { getPublicEnvs } from './load.envs';

const config: Config.InitialOptions = {
  ...baseConfig,
  globals: {
    ...baseConfig.globals,
    'ts-jest': {
      useESM: true,
      diagnostics: {
        ignoreCodes: [1343],
      },
      astTransformers: {
        before: [
          {
            path: './node_modules/ts-jest-mock-import-meta',
            options: { metaObjectReplacement: { env: getPublicEnvs() } },
          },
        ],
      },
    },
  },
  rootDir: __dirname,
  displayName: pkg.name,
  setupFilesAfterEnv: [require.resolve('@fuel-ui/test-utils/setup')],
  setupFiles: ['./load.envs.js', 'fake-indexeddb/auto'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
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
