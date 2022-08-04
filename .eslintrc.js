const config = require('@fuel-ui/config');
const path = require('path');

const resolveRoot = (dir = '') => path.resolve(__dirname, dir);

module.exports = {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    tsConfigRootDir: resolveRoot(),
    project: [resolveRoot('./tsconfig.eslint.json'), resolveRoot('./**/**/tsconfig.json')],
  },
};
