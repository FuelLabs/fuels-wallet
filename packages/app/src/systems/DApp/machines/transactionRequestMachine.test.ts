import type { TransactionRequest } from 'fuels';
import { interpret } from 'xstate';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';
import type { MockVaultData } from '~/systems/Core/__tests__/utils/mockVault';
import { mockVault } from '~/systems/Core/__tests__/utils/mockVault';

import { getMockedTransaction } from '../__mocks__/dapp-transaction';

import type { TransactionRequestService } from './transactionRequestMachine';
import { transactionRequestMachine } from './transactionRequestMachine';

describe('txApproveMachine', () => {
  let service: TransactionRequestService;
  let transactionRequest: TransactionRequest;
  let data: MockVaultData;
  const openDialog = jest.fn();

  beforeAll(async () => {
    data = await mockVault();
    transactionRequest = await getMockedTransaction(
      data.account?.address.toLocaleLowerCase() || '',
      '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
      data.network?.url || ''
    );
  });

  beforeEach(async () => {
    service = interpret(
      transactionRequestMachine
        .withContext({ input: {}, response: {} })
        .withConfig({ actions: { openDialog } })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it.only('should approve/send transaction', async () => {
    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: {
        address: data.account?.address,
        transactionRequest,
        providerUrl: data.network?.url,
        origin: 'foo.com',
      },
    });

    await expectStateMatch(service, 'simulatingTransaction');
    await expectStateMatch(service, 'waitingApproval');

    service.send('APPROVE');

    await expectStateMatch(service, 'sendingTx');
    await expectStateMatch(service, 'txSuccess');
  });
});
