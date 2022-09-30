import type { Story } from '@storybook/react';

import { AddNetwork } from './AddNetwork';

import { Pages } from '~/systems/Core';

export default {
  component: AddNetwork,
  title: 'Network/Pages/2. AddNetwork',
  parameters: {
    reactRouter: {
      routePath: Pages.networkAdd(),
    },
  },
};

export const Usage: Story<unknown> = () => <AddNetwork />;
