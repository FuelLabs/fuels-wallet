import type { ScriptTransactionRequest, WalletUnlocked } from 'fuels';
import { Wallet } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { getMockedTransaction } from '../__mocks__/dapp-transaction';

import { txApproveMachine } from './txApproveMachine';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';

type Service = InterpreterFrom<typeof txApproveMachine>;

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const providerUrl = import.meta.env.VITE_FUEL_PROVIDER_URL;

describe('txApproveMachine', () => {
  let service: Service;
  let wallet: WalletUnlocked;
  let tx: ScriptTransactionRequest;

  beforeAll(async () => {
    wallet = Wallet.fromPrivateKey(OWNER);
    jest.spyOn(AccountService, 'unlock').mockResolvedValue({
      ...wallet,
      exportVault: () => '',
    });
    tx = await getMockedTransaction(
      wallet?.publicKey || '',
      '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
      providerUrl
    );
  });

  beforeEach(async () => {
    service = interpret(txApproveMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should approve/send transaction', async () => {
    await waitFor(service, (state) => state.matches('waitingTxRequest'));

    service.send('CALCULATE_GAS', { input: { tx, providerUrl } });

    await waitFor(service, (state) => state.matches('calculatingGas'));
    await waitFor(service, (state) => state.matches('idle'));

    service.send('START_APPROVE', { input: { providerUrl } });

    await waitFor(service, (state) => state.matches('unlocking'));

    service.send('UNLOCK_WALLET', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('approving'));
    const { matches } = await waitFor(service, (state) =>
      state.matches('done')
    );
    expect(matches('done')).toBeTruthy();
  });
});
