const nextConfig = require('eslint-config-next');
const path = require('path');

const config = require('../config');

const resolveRoot = (dir = '') => path.resolve(__dirname, dir);

module.exports = {
  ...config,
  extends: [...config.extends, 'next/core-web-vitals'],
  plugins: [...config.plugins, ...nextConfig.plugins],
  parserOptions: {
    ...config.parserOptions,
    tsConfigRootDir: resolveRoot(),
    project: [
      resolveRoot('../../tsconfig.eslint.json'),
      resolveRoot('./tsconfig.json'),
    ],
  },
};
