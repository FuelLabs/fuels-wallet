import type { StoryFn } from '@storybook/react';
import { graphql } from 'msw';

import { ChangePassword } from './ChangePassword';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { MOCK_ASSETS_NODE } from '~/systems/Asset/__mocks__/assets';

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
