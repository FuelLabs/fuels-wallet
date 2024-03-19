import { join } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tsconfigpath from 'vite-tsconfig-paths';

import { resolveLinkDeps } from '../vite-utils/vite.base.config';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../connect/**/*.stories.@(js|jsx|ts|tsx)',
  ],
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
  async viteFinal(config) {
    return mergeConfig(config, {
      ...resolveLinkDeps(),
      base: join(process.env.STORYBOOK_BASE_URL || config.base || ''),
      plugins: [tsconfigpath()],
      resolve: {
        alias: {
          '/icons/sprite.svg': '/public/icons/sprite.svg',
        },
      },
    });
  },
};

export default config;
