import { graphql } from 'msw';

import { MOCK_TRANSACTIONS_BY_OWNER } from '../../__mocks__/transactions';

import { ViewActivity } from './ViewActivity';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { GraphqlProvider } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';

export default {
  component: ViewActivity,
  title: 'Transaction/Pages/ViewActivity',
  parameters: {
    layout: 'fullscreen',
  },
  msw: [
    graphql.query('getTransactionWithReceipts', (req, res, ctx) => {
      return res(ctx.data(MOCK_TRANSACTIONS_BY_OWNER));
    }),
  ],
  loaders: [
    async () => {
      await NetworkService.clearNetworks();
      await NetworkService.addNetwork({ data: MOCK_NETWORKS[0] });
      await AccountService.clearAccounts();
      await AccountService.addAccount({ data: MOCK_ACCOUNTS[4] });
      return {};
    },
  ],
};

export const Usage = () => (
  <GraphqlProvider>
    <ViewActivity />
  </GraphqlProvider>
);
