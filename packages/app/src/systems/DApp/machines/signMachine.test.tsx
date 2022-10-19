import { Wallet } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { signMachine } from './signMachine';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';

type Service = InterpreterFrom<typeof signMachine>;

const OWNER = import.meta.env.VITE_ADDR_OWNER;

describe('signMachine', () => {
  let service: Service;
  let wallet: Wallet;

  beforeAll(async () => {
    wallet = new Wallet(OWNER);
    jest.spyOn(AccountService, 'unlock').mockResolvedValue(wallet);
  });

  beforeEach(async () => {
    service = interpret(signMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should sign message', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send('START_SIGN', {
      input: {
        message: 'test message',
      },
    });

    await waitFor(service, (state) => state.matches('unlocking'));

    service.send('UNLOCK_WALLET', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('signingMessage'));
    const { matches } = await waitFor(service, (state) =>
      state.matches('done')
    );
    expect(matches('done')).toBeTruthy();
  });
});
