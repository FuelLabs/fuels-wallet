import tsconfigpath from 'vite-tsconfig-paths';
import { mergeConfig } from 'vite';
import type { StorybookConfig } from '@storybook/react-vite';

import { resolveLinkDeps } from '../vite-utils/vite.base.config';

const config: StorybookConfig = {
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
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config: any) {
    return mergeConfig(config, {
      ...resolveLinkDeps(),
      plugins: [tsconfigpath()],
    });
  },
};

export default config;
