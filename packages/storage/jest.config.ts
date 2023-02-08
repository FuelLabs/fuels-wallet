/* eslint-disable import/no-extraneous-dependencies */
import baseDefaultConfig from '@fuel-ui/test-utils/config';
import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

import pkg from './package.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { globals, preset, ...baseConfig } = baseDefaultConfig;

const config: JestConfigWithTsJest = {
  ...baseConfig,
  displayName: pkg.name,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  injectGlobals: true,
  modulePathIgnorePatterns: ['/dist/'],
  resetMocks: false,
  rootDir: __dirname,
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: [require.resolve('@fuel-ui/test-utils/setup')],
  testTimeout: 10000,
  transform: tsjPreset.transform,
};

export default config;
