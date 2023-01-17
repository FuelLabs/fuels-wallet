import type { StoryFn } from '@storybook/react';

import { ChangePassword } from './ChangePassword';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { mockBalancesOnGraphQL } from '~/systems/Asset/__mocks__/assets';

export default {
  component: ChangePassword,
  title: 'Settings/Pages/1. ChangePassword',
  parameters: {
    layout: 'fullscreen',
  },
  loaders: [
    async () => {
      await AccountService.clearAccounts();
      await AccountService.addAccount({ data: MOCK_ACCOUNTS[0] });
      return {};
    },
  ],
};

export const Usage: StoryFn<unknown> = () => <ChangePassword />;
Usage.parameters = {
  msw: [mockBalancesOnGraphQL()],
};
