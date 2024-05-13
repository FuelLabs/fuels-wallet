import { type TransactionRequest, bn } from 'fuels';
import { interpret } from 'xstate';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';
import type { MockVaultData } from '~/systems/Core/__tests__/utils/mockVault';
import { mockVault } from '~/systems/Core/__tests__/utils/mockVault';

import { getMockedTransaction } from '../__mocks__/dapp-transaction';

import type { TransactionRequestService } from './transactionRequestMachine';
import { transactionRequestMachine } from './transactionRequestMachine';

describe('txApproveMachine', () => {
  let service: TransactionRequestService;
  let transactionRequest: TransactionRequest | undefined;
  let data: MockVaultData;
  const openDialog = jest.fn();

  beforeAll(async () => {
    data = await mockVault();
    const mocked = await getMockedTransaction(
      '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
      data.network?.url || ''
    );
    transactionRequest = mocked?.transactionRequest;
  });

  beforeEach(() => {
    service = interpret(
      transactionRequestMachine
        .withContext({ input: {}, fees: {}, customFee: { tip: bn(0) } })
        .withConfig({ actions: { openDialog } })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should approve/send transaction', async () => {
    await expectStateMatch(service, 'idle');

    service.send('START', {
      input: {
        address: data.account?.address,
        origin: 'foo.com',
        transactionRequest,
        providerUrl: data.network?.url,
      },
    });

    await expectStateMatch(service, 'simulatingTransaction');
    await expectStateMatch(service, 'waitingApproval');

    service.send('APPROVE');

    await expectStateMatch(service, 'sendingTx');
    await expectStateMatch(service, 'txSuccess');
  });
});
