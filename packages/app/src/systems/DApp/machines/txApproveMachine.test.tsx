import type { ScriptTransactionRequest } from 'fuels';
import { Wallet } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { getMockedTransaction } from '../__mocks__/transaction';

import { txApproveMachine } from './txApproveMachine';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';
import { provider } from '~/systems/Core';

type Service = InterpreterFrom<typeof txApproveMachine>;

const OWNER = import.meta.env.VITE_ADDR_OWNER;

describe('txApproveMachine', () => {
  let service: Service;
  let wallet: Wallet;
  let tx: ScriptTransactionRequest;

  beforeAll(async () => {
    wallet = new Wallet(OWNER);
    jest.spyOn(AccountService, 'unlock').mockResolvedValue(wallet);
    tx = await getMockedTransaction(
      wallet?.publicKey || '',
      '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077',
      provider
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

    service.send('CALCULATE_GAS', { input: { tx } });

    await waitFor(service, (state) => state.matches('calculatingGas'));
    await waitFor(service, (state) => state.matches('idle'));

    service.send('START_APPROVE');

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
