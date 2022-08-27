import type { Config } from '@jest/types';
import { resolve } from 'path';

import './load.envs.js';
import pkg from './package.json';

const config: Config.InitialOptions = {
  rootDir: __dirname,
  displayName: pkg.name,
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testTimeout: 20000,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: [resolve(__dirname, './jest.setup.ts')],
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  modulePathIgnorePatterns: ['/dist/'],
  coveragePathIgnorePatterns: ['/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub',
    '~/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
