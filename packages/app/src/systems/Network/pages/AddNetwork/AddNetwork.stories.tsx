import type { Meta, Story } from '@storybook/react';

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

export const Usage: Story<unknown> = () => <AddNetwork />;
