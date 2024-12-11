import baseDefaultConfig from '@fuel-ui/test-utils/config';
import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

import { getPublicEnvs } from './load.envs.cts';
import pkg from './package.json';

const { globals, preset, ...baseConfig } = baseDefaultConfig;
const esModules = [
  'nanoid',
  'p-cancelable',
  'reaflow',
  'easy-email-core',
  'uuid/dist/esm-browser',
  'd3-path/src',
  'd3-shape/src',
  '@web3modal',
  '@fuels/connectors',
].join('|');
const config: JestConfigWithTsJest = {
  ...baseConfig,
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        ...tsjPreset[1],
        useESM: true,
        diagnostics: {
          ignoreCodes: [1343],
          warnOnly: true,
          pretty: true,
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
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  testTimeout: 10000,
  forceExit: false,
  detectOpenHandles: true,
  modulePathIgnorePatterns: ['/dist/', 'playwright', 'uuid/dist/esm-browser'],
  maxWorkers: 1,
  rootDir: __dirname,
  displayName: pkg.name,
  setupFilesAfterEnv: [
    require.resolve('@fuel-ui/test-utils/setup'),
    './jest.setup.ts',
  ],
  setupFiles: ['fake-indexeddb/auto'],
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
    '^uuid$': require.resolve('uuid'),
    '^@web3modal/core$': require.resolve('@web3modal/core'),
  },
};

export default config;
