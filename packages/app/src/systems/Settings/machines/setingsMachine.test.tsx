import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { settingsMachine } from './settingsMachine';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';

const WORDS = [
  'strange',
  'purple',
  'adamant',
  'crayons',
  'entice',
  'fun',
  'eloquent',
  'missiles',
  'milk',
  'ice',
  'cream',
  'apple',
];

describe('settingsMachine', () => {
  let service: InterpreterFrom<typeof settingsMachine>;
  const redirectToWallet = jest.fn();

  beforeAll(async () => {
    jest
      .spyOn(AccountService, 'exportVault')
      .mockResolvedValue(WORDS.join(' '));
  });

  beforeEach(async () => {
    service = interpret(
      settingsMachine.withContext({}).withConfig({
        actions: {
          goToWallet: redirectToWallet,
        },
      })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should get mnemonic phrase', async () => {
    service.send('REVEAL_PASSPHRASE', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('gettingMnemonic'));
    const state = await waitFor(service, (state) => state.matches('done'));
    expect(state.context.words?.length).toBeGreaterThan(1);
  });

  it('should change the password and redirect to home after', async () => {
    service.send('CHANGE_PASSWORD', {
      input: {
        newPassword: '12345678',
        oldPassword: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('changingPassword'));
    await waitFor(service, (state) => state.matches('done'));
    expect(redirectToWallet).toBeCalled();
  });
});
