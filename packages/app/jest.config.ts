/* eslint-disable import/no-extraneous-dependencies */
import baseConfig from '@fuel-ui/test-utils/config';
import type { Config } from '@jest/types';

import './load.envs.ts';
import pkg from './package.json';

const config: Config.InitialOptions = {
  ...baseConfig,
  rootDir: __dirname,
  displayName: pkg.name,
};

export default config;
