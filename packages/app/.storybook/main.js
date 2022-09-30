const { join } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getPublicEnvs } = require('../load.envs');
const webpack = require('webpack');
const path = require('path');

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
    'storybook-addon-react-router-v6',
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
    config.resolve.alias = {
      ...config.resolve.alias,
      '@fuels-wallet/xstore': path.resolve(__dirname, '../../store/dist'),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
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
