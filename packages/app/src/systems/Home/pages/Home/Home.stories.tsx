import type { Meta, StoryFn } from '@storybook/react';
import { store } from '~/store';
import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { mockBalancesOnGraphQL } from '~/systems/Asset/__mocks__/assets';

import { Home } from './Home';

export default {
  component: Home,
  title: 'Home/Pages/Home',
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
      store.reset();
      return {};
    },
  ],
} as Meta;

export const NoAssets: StoryFn<unknown> = () => <Home />;
NoAssets.parameters = {
  msw: [mockBalancesOnGraphQL([])],
};

export const WithAssets: StoryFn<unknown> = () => <Home />;
WithAssets.parameters = {
  msw: [mockBalancesOnGraphQL()],
};
