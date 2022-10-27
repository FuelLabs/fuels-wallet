import type { Meta, StoryFn } from '@storybook/react';
import { graphql } from 'msw';

import { Wallet } from './Wallet';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { MOCK_ASSETS_NODE } from '~/systems/Asset/__mocks__/assets';

export default {
  component: Wallet,
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
      return {};
    },
  ],
} as Meta;

export const NoAssets: StoryFn<unknown> = () => <Wallet />;
export const WithAssets: StoryFn<unknown> = () => <Wallet />;
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
