import type { Meta, StoryFn } from '@storybook/react';
import { bn } from 'fuels';
import { graphql } from 'msw';

import { Wallet } from './Wallet';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { ASSET_LIST } from '~/systems/Asset';

const ASSETS_MOCK = [
  {
    node: {
      assetId: ASSET_LIST[0].assetId,
      amount: bn(30000000000),
    },
  },
  {
    node: {
      assetId: ASSET_LIST[1].assetId,
      amount: bn(1500000000000),
    },
  },
  {
    node: {
      assetId: ASSET_LIST[2].assetId,
      amount: bn(120000000),
    },
  },
];

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
            edges: ASSETS_MOCK,
          },
        })
      );
    }),
  ],
};
