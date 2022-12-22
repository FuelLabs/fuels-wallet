import { Wallet } from '@fuel-ts/wallet';
import type { WalletUnlocked } from '@fuel-ts/wallet';
import type { ScriptTransactionRequest } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { getMockedTransaction } from '../__mocks__/dapp-transaction';

import type { TransactionMachineService } from './transactionMachine';
import { transactionMachine } from './transactionMachine';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;

describe('txApproveMachine', () => {
  let service: TransactionMachineService;
  let wallet: WalletUnlocked;
  let transactionRequest: ScriptTransactionRequest;

  beforeAll(async () => {
    wallet = Wallet.fromPrivateKey(OWNER);
    jest.spyOn(AccountService, 'unlock').mockResolvedValue(wallet);
    transactionRequest = await getMockedTransaction(
      wallet?.publicKey || '',
      '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
      providerUrl
    );
  });

  beforeEach(async () => {
    service = interpret(transactionMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should approve/send transaction', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send('START_REQUEST', {
      input: { transactionRequest, providerUrl, origin: 'foo.com' },
    });

    await waitFor(service, (state) => state.matches('simulatingTransaction'));
    await waitFor(service, (state) => state.matches('waitingApproval'));

    service.send('APPROVE');

    await waitFor(service, (state) => state.matches('unlocking'));

    service.send('UNLOCK_WALLET', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('sendingTx'));
    const { matches } = await waitFor(service, (state) =>
      state.matches('done')
    );
    expect(matches('done')).toBeTruthy();
  });
});
