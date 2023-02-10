/* eslint-disable import/no-extraneous-dependencies */
import baseDefaultConfig from '@fuel-ui/test-utils/config';
import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

import pkg from './package.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { globals, preset, ...baseConfig } = baseDefaultConfig;

const config: JestConfigWithTsJest = {
  ...baseConfig,
  transform: tsjPreset.transform,
  testTimeout: 10000,
  modulePathIgnorePatterns: ['/dist/'],
  rootDir: __dirname,
  displayName: pkg.name,
  setupFilesAfterEnv: [require.resolve('@fuel-ui/test-utils/setup')],
  setupFiles: ['jest-localstorage-mock'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  injectGlobals: true,
};

export default config;
