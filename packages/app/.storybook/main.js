const { mergeConfig } = require('vite');
const { resolve } = require('path');
const react = require('@vitejs/plugin-react');
const { default: tsconfigPaths } = require('vite-tsconfig-paths');

const WHITELIST = ['NODE_ENV', 'PUBLIC_URL'];
const ENV_VARS = Object.entries(process.env).filter(([key]) =>
  WHITELIST.some((k) => k === key || key.match(/^VITE_/))
);

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      build: {
        target: ['es2020'],
        outDir: process.env.BUILD_PATH || 'dist',
      },
      plugins: [tsconfigPaths()],
      define: {
        'process.env': Object.fromEntries(ENV_VARS),
      },
      resolve: {
        /**
         * We need this to get right build script and use PNPM link correctly
         */
        alias: {
          '@fuel-ui/react': resolve(__dirname, '../node_modules/@fuel-ui/react/dist/index.mjs'),
          '@fuel-ui/css': resolve(__dirname, '../node_modules/@fuel-ui/css/dist/index.mjs'),
        },
      },
    });
  },
};
