import type { Story } from '@storybook/react';

import { MOCK_NETWORKS } from '../../__mocks__/networks';
import { NetworkService } from '../../services';

import { Networks } from './Networks';

export default {
  component: Networks,
  title: 'Network/Pages/1. Networks',
};

export const Usage: Story<unknown> = () => <Networks />;
Usage.decorators = [
  (Story) => {
    NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
    NetworkService.addNetwork({ data: MOCK_NETWORKS[1] });

    return <Story />;
  },
];
