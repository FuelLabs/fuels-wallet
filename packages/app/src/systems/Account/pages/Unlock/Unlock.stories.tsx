import type { Story } from '@storybook/react';

import { createMockAccount } from '../../__mocks__';

import { Unlock } from './Unlock';

export default {
  component: Unlock,
  title: 'Account/Pages/Unlock',
  parameters: {
    reactRouter: {
      routePath: '/account/unlock',
      routeState: {
        lastPath: '/wallet',
      },
    },
  },
};

export const Usage: Story<never> = () => <Unlock />;
Usage.loaders = [
  async () => {
    await createMockAccount('123123123');
    return {};
  },
];
