import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

import pkg from './package.json';

const config: JestConfigWithTsJest = {
  displayName: pkg.name,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  modulePathIgnorePatterns: ['dist'],
  rootDir: __dirname,
  transform: tsjPreset.transform,
  setupFilesAfterEnv: ['./jest.setup.ts'],
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testMatch: ['./**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  verbose: true,
  globals: {
    window: {},
  },
};

export default config;
