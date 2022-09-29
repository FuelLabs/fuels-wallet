import type { Story } from '@storybook/react';
import type { FunctionComponent } from 'react';

import { AddNetwork } from './AddNetwork';

import { Pages } from '~/systems/Core';
import { GlobalMachinesProvider } from '~/systems/Global';

export default {
  component: AddNetwork,
  title: 'Network/Pages/2. AddNetwork',
  decorators: [
    (Story: FunctionComponent) => (
      <GlobalMachinesProvider>
        <Story />
      </GlobalMachinesProvider>
    ),
  ],
  parameters: {
    reactRouter: {
      routePath: Pages.networkAdd(),
    },
  },
};

export const Usage: Story<unknown> = () => <AddNetwork />;
