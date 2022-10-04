/* eslint-disable import/no-extraneous-dependencies */
import baseDefaultConfig from '@fuel-ui/test-utils/config';
import type { InitialOptionsTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

import { getPublicEnvs } from './load.envs';
import pkg from './package.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { globals, preset, ...baseConfig } = baseDefaultConfig;

const config: InitialOptionsTsJest = {
  ...baseConfig,
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        ...tsjPreset[1],
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
    ],
  },
  modulePathIgnorePatterns: ['/dist/', 'playwright'],
  maxWorkers: 1,
  rootDir: __dirname,
  displayName: pkg.name,
  setupFilesAfterEnv: [
    require.resolve('@fuel-ui/test-utils/setup'),
    './jest.setup.ts',
  ],
  setupFiles: ['./load.envs.js', 'fake-indexeddb/auto'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  injectGlobals: true,
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
