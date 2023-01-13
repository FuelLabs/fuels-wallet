import type { StoryFn } from '@storybook/react';

import { RevealPassphrase } from './RevealPassphrase';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { mockBalancesOnGraphQL } from '~/systems/Asset/__mocks__/assets';

export default {
  component: RevealPassphrase,
  title: 'Settings/Pages/1. RevealPassphrase',
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

export const Usage: StoryFn<unknown> = () => <RevealPassphrase />;
Usage.parameters = {
  msw: [mockBalancesOnGraphQL()],
};
