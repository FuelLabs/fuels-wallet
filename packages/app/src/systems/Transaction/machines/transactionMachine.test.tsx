import { graphql } from 'msw';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { MOCK_TRANSACTION_WITH_RECEIPTS_GQL } from '../__mocks__/transaction';

import type { TransactionMachineService } from './transactionMachine';
import { transactionMachine } from './transactionMachine';

import { mockServer } from '~/mocks/server';

const TRANSACTION_ID =
  '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077';

mockServer([
  graphql.query('getTransactionWithReceipts', (_req, res, ctx) => {
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

    service.send('GET_TRANSACTION', { input: { txId: TRANSACTION_ID } });

    await waitFor(service, (state) => state.matches('fetching'));
    await waitFor(service, (state) => state.matches('fetchingResult'));
    await waitFor(service, (state) => state.matches('idle'));
    await waitFor(service, (state) => Boolean(state.context.tx));
    await waitFor(service, (state) => Boolean(state.context.txResult));
  });
});
