import type { Meta, StoryFn } from '@storybook/react';
import { graphql } from 'msw';

import { Home } from './Home';

import { store } from '~/store';
import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { MOCK_ASSETS_NODE } from '~/systems/Asset/__mocks__/assets';

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
  msw: [
    graphql.query('getBalances', (req, res, ctx) => {
      return res(
        ctx.data({
          balances: {
            edges: [],
          },
        })
      );
    }),
  ],
};

export const WithAssets: StoryFn<unknown> = () => <Home />;
WithAssets.parameters = {
  msw: [
    graphql.query('getBalances', (req, res, ctx) => {
      return res(
        ctx.data({
          balances: {
            edges: MOCK_ASSETS_NODE,
          },
        })
      );
    }),
  ],
};
