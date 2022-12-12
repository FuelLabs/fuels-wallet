import { graphql } from 'msw';
import { Route, Routes } from 'react-router-dom';

import { MOCK_TRANSACTION_WITH_RECEIPTS_GQL } from '../../__mocks__/transaction';

import { ViewTransaction } from './ViewTransaction';

import { Pages } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';
import { MOCK_NETWORKS } from '~/systems/Network/__mocks__/networks';

const ViewTransactionStory = ({ txId }: { txId: string }) => {
  return (
    <Routes location={Pages.tx({ txId })}>
      <Route path={Pages.tx()} element={<ViewTransaction />} />
    </Routes>
  );
};

export default {
  component: ViewTransactionStory,
  title: 'Transaction/Components/ViewTransaction',
  argTypes: {
    txId: {
      defaultValue:
        '0xc019789a1d43f6ed799bcd4abf6b5a69ce91e60710e3bc6ab3b2ca0996cdef4d',
      type: 'string',
    },
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
    msw: [
      graphql.query('getTransactionWithReceipts', (req, res, ctx) => {
        if (
          req.variables.transactionId ===
          MOCK_TRANSACTION_WITH_RECEIPTS_GQL.transaction.id
        ) {
          return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
        }

        return undefined;
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
};

export const Usage = ({ txId }: { txId: string }) => (
  <ViewTransactionStory txId={txId} />
);
