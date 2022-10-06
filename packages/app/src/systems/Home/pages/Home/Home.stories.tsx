import type { Story } from '@storybook/react';
import { bn } from 'fuels';
import { graphql } from 'msw';

import { Home } from './Home';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { ASSET_LIST } from '~/systems/Asset';

export default {
  component: Home,
  title: 'Home/Pages/Home',
};

export const Loading: Story<unknown> = () => <Home />;
Loading.decorators = [
  (Story) => {
    AccountService.clearAccounts();
    return <Story />;
  },
];

export const NoAssets: Story<unknown> = () => <Home />;
NoAssets.decorators = [
  (Story) => {
    AccountService.clearAccounts();
    AccountService.addAccount({
      data: MOCK_ACCOUNTS[0],
    });

    return <Story />;
  },
];

export const WithAssets: Story<unknown> = () => <Home />;
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

// mock api response for balances
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
WithAssets.decorators = [
  (Story) => {
    AccountService.clearAccounts();
    AccountService.addAccount({
      data: MOCK_ACCOUNTS[0],
    });

    return <Story />;
  },
];
