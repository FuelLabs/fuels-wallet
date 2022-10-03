const config = require('./packages/config');
const path = require('path');

const resolveRoot = (dir = '') => path.resolve(__dirname, dir);

module.exports = {
  ...config,
  parserOptions: {
    ...config.parserOptions,
    tsConfigRootDir: resolveRoot(),
    project: [
      resolveRoot('./tsconfig.eslint.json'),
      resolveRoot('./**/**/tsconfig.json'),
    ],
  },
};
