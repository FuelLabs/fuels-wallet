import type { StoryFn } from '@storybook/react';
import { graphql } from 'msw';

import { RevealPassphrase } from './RevealPassphrase';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { MOCK_ASSETS_NODE } from '~/systems/Asset/__mocks__/assets';

export default {
  component: RevealPassphrase,
  title: 'Settings/Pages/2. RevealPassphrase',
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
