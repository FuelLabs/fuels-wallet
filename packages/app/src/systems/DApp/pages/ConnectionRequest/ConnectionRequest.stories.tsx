import type { Meta, Story } from '@storybook/react';
import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { mockBalancesOnGraphQL } from '~/systems/Asset/__mocks__/assets';

import { ConnectionRequest } from './ConnectionRequest';

export default {
  component: ConnectionRequest,
  title: 'DApp/Pages/ConnectionRequest',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
  loaders: [
    async () => {
      await AccountService.clearAccounts();
      await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
      return {};
    },
  ],
} as Meta;

export const Usage: Story<unknown> = () => <ConnectionRequest />;
Usage.parameters = {
  msw: [mockBalancesOnGraphQL()],
};
