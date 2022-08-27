const { join } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getPublicEnvs } = require('../load.envs');

const config = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
    '@storybook/addon-jest',
    'storybook-dark-mode',
  ],
  staticDirs: ['../public'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  env: (config) => ({ ...config, ...getPublicEnvs() }),
  webpackFinal: async (config) => {
    if (config.build) {
      config.base = join(process.env.BASE_URL || config.base || '', 'storybook');
    }
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    return config;
  },
};

module.exports = config;
