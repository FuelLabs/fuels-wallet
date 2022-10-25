import type { Meta, StoryFn } from '@storybook/react';

import { AddNetwork } from './AddNetwork';

import { Pages } from '~/systems/Core';

export default {
  component: AddNetwork,
  title: 'Network/Pages/2. AddNetwork',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
    reactRouter: {
      routePath: Pages.networkAdd(),
    },
  },
} as Meta;

export const Usage: StoryFn<unknown> = () => <AddNetwork />;
