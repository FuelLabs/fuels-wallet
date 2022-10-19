import { Wallet } from 'fuels';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { unlockMachine } from './unlockMachine';

import { MOCK_ACCOUNTS } from '~/systems/Account';

type Service = InterpreterFrom<typeof unlockMachine>;

const OWNER = import.meta.env.VITE_ADDR_OWNER;

describe('unlockMachine', () => {
  let service: Service;
  const account = MOCK_ACCOUNTS[0];
  const wallet = new Wallet(OWNER);

  beforeEach(async () => {
    service = interpret(
      unlockMachine.withContext({}).withConfig({
        services: {
          unlock: () => Promise.resolve(wallet),
        },
      })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should unlock message', async () => {
    await waitFor(service, (state) => state.matches('waitingPassword'));
    service.send('UNLOCK_WALLET', {
      input: {
        password: 'qwe123',
        account,
      },
    });
    await waitFor(service, (state) => state.matches('unlocking'));
    const { matches } = await waitFor(service, (state) =>
      state.matches('done')
    );
    expect(matches('done')).toBeTruthy();
  });
});
