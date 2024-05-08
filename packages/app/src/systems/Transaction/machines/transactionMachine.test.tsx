import { graphql } from 'msw';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { mockServer } from '~/mocks/server';

import { MOCK_TRANSACTION_WITH_RECEIPTS_GQL } from '../__mocks__/transaction';

import type { TransactionMachineService } from './transactionMachine';
import { transactionMachine } from './transactionMachine';

mockServer([
  graphql.query('getTransactionWithReceipts', (_req, res, ctx) => {
    return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
  }),
  graphql.query('getChain', (_req, res, ctx) => {
    return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
  }),
  graphql.query('getNodeInfo', (_req, res, ctx) => {
    return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
  }),
  graphql.query('getLatestGasPrice', (_req, res, ctx) => {
    return res(ctx.data(MOCK_TRANSACTION_WITH_RECEIPTS_GQL));
  }),
]);

describe('transactionMachine', () => {
  let service: TransactionMachineService;

  beforeEach(async () => {
    service = interpret(transactionMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should fetch transaction', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send('GET_TRANSACTION', {
      input: { txId: MOCK_TRANSACTION_WITH_RECEIPTS_GQL.transaction.id },
    });

    await waitFor(service, (state) => state.matches('fetching'));
    await waitFor(service, (state) => Boolean(state.context.txResult));
    await waitFor(service, (state) => Boolean(state.context.txResponse));
    await waitFor(service, (state) => state.matches('done'));
  });
});
