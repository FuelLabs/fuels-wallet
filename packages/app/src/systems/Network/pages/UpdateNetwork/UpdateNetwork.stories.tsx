import type { Story } from '@storybook/react';

import { MOCK_NETWORKS } from '../../__mocks__';
import { NetworkService } from '../../services';

import { UpdateNetwork } from './UpdateNetwork';

import { Pages } from '~/systems/Core';

export default {
  component: UpdateNetwork,
  title: 'Network/Pages/3. UpdateNetwork',
  parameters: {
    reactRouter: {
      routePath: Pages.networkUpdate(),
      routeParams: { id: '1' },
    },
  },
};

export const Usage: Story<unknown> = () => <UpdateNetwork />;
Usage.decorators = [
  (Story) => {
    NetworkService.addNetwork({
      data: MOCK_NETWORKS[0],
    });

    return <Story />;
  },
];
