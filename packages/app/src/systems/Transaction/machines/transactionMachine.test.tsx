import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { TransactionMachineService } from './transactionMachine';
import { transactionMachine } from './transactionMachine';

const TRANSACTION_ID =
  '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077';

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
  });
});
