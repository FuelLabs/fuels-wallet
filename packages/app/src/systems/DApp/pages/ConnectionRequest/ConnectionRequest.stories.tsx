import type { Meta, Story } from '@storybook/react';
import { graphql } from 'msw';

import { ConnectionRequest } from './ConnectionRequest';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { MOCK_ASSETS_NODE } from '~/systems/Asset/__mocks__/assets';

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
