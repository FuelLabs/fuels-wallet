const { join } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getPublicEnvs } = require('../load.envs');
const webpack = require('webpack');
const { resolve } = require('path');
const homedir = require('os').homedir();

const PNPM_STORE = '.pnpm-store';

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
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
    };
    config.resolve.alias = {
      '@fuel-ui/react': resolve(homedir, PNPM_STORE, '@fuel-ui/react/dist/index.js'),
      '@fuel-ui/css': resolve(homedir, PNPM_STORE, '@fuel-ui/css/dist/index.js'),
    };
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    config.plugins.push(
      require('@import-meta-env/unplugin').webpack({
        env: '.env',
        example: '.env.example',
      }),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
      })
    );
    return config;
  },
};

module.exports = config;
