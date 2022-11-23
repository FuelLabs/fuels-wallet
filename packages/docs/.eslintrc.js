const nextConfig = require('eslint-config-next');
const path = require('path');

const config = require('../config');

const resolveRoot = (dir = '') => path.resolve(__dirname, dir);

module.exports = {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    tsConfigRootDir: resolveRoot(),
    project: [
      resolveRoot('../../tsconfig.eslint.json'),
      resolveRoot('./tsconfig.json'),
    ],
  },
  rules: {
    ...config.rules,
    'import/no-cycle': 'off',
    'import/order': config.rules['import/order'],
  },
};
