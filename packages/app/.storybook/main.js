const { join } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getPublicEnvs } = require('../load.envs');
const importMetaEnv = require('@import-meta-env/unplugin');
const webpack = require('webpack');

const config = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
    'storybook-dark-mode',
    'storybook-addon-react-router-v6',
  ],
  staticDirs: ['../public'],
  framework: '@storybook/react',
  core: {
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
        fsCache: true,
      },
    },
  },
  features: {
    storyStoreV7: true,
  },
  env: (config) => ({ ...config, ...getPublicEnvs() }),
  webpackFinal: async (config) => {
    if (config.build) {
      config.base = join(
        process.env.BASE_URL || config.base || '',
        'storybook'
      );
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
    };
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    config.plugins.push(
      new webpack.DefinePlugin({
        'import.meta.env': JSON.stringify(getPublicEnvs()),
      })
    );
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
      })
    );
    return config;
  },
};

module.exports = config;
