import type { Meta, Story } from '@storybook/react';
import { graphql } from 'msw';

import { MOCK_TRANSACTION_WITH_RECEIPTS_GQL } from '../../__mocks__/transaction';

import { ViewTransaction } from './ViewTransaction';

import { Pages } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';

export default {
  component: ViewTransaction,
  title: 'Transaction/Components/ViewTransaction',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
    reactRouter: {
      routePath: Pages.tx(),
      routeParams: {
        txId: '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
      },
    },
    msw: [
      graphql.query('getTransactionWithReceipts', (req, res, ctx) => {
        return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
      }),
    ],
  },
  loaders: [
    async () => {
      await NetworkService.clearNetworks();
      await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
      return {};
    },
  ],
} as Meta;

export const Usage: Story<unknown> = () => <ViewTransaction />;
