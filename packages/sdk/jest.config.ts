/* eslint-disable import/no-extraneous-dependencies */
import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

import './load.envs';
import pkg from './package.json';

const config: JestConfigWithTsJest = {
  displayName: pkg.name,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  modulePathIgnorePatterns: ['dist'],
  rootDir: __dirname,
  transform: tsjPreset.transform,
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['./**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  verbose: true,
};

export default config;
