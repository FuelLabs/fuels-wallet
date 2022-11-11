import type { JestConfigWithTsJest } from 'ts-jest';
import { defaultsESM as tsjPreset } from 'ts-jest/presets';

export type Config = JestConfigWithTsJest;

export const config: JestConfigWithTsJest = {
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { ...tsjPreset[1], useESM: true }],
  },
  testTimeout: 20000,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: ['dotenv/config'],
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
