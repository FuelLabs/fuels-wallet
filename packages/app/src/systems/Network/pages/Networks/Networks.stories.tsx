import type { Story } from '@storybook/react';
import type { FunctionComponent } from 'react';

import { MOCK_NETWORKS } from '../../__mocks__';
import { NetworkService } from '../../services';

import { Networks } from './Networks';

import { GlobalMachinesProvider } from '~/systems/Global';

export default {
  component: Networks,
  title: 'Network/Pages/1. Networks',
  decorators: [
    (Story: FunctionComponent) => (
      <GlobalMachinesProvider>
        <Story />
      </GlobalMachinesProvider>
    ),
  ],
};

export const Usage: Story<unknown> = () => <Networks />;
Usage.decorators = [
  (Story) => {
    NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
    NetworkService.addNetwork({ data: MOCK_NETWORKS[1] });

    return <Story />;
  },
];
