import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { settingsMachine } from './settingsMachine';

import type { AccountInputs } from '~/systems/Account';
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
      settingsMachine.withConfig({
        actions: {
          goToWallet: redirectToWallet,
        },
      })
    ).start();
  });

  it('should get mnemonic phrase', async () => {
    service.send('UNLOCK_WALLET', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('gettingMnemonic'));

    const { matches } = await waitFor(service, (state) =>
      state.matches('done')
    );

    const { event } = service.getSnapshot();

    expect(event.data?.length).toBeGreaterThan(1);
    expect(matches('done')).toBeTruthy();
  });

  it('should change the password of the user and we should be able to unlock it agan', async () => {
    service.send('CHANGE_PASSWORD', {
      newPassword: '12345678',
      oldPassword: '123123',
    } as AccountInputs['changePassword']);

    await waitFor(service, (state) => state.matches('unlocking'));

    service.send('UNLOCK_WALLET', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '12345678',
      },
    });

    const { matches } = await waitFor(service, (state) =>
      state.matches('done')
    );

    const { event } = service.getSnapshot();

    expect(event.data?.length).toBeGreaterThan(1);
    expect(matches('done')).toBeTruthy();
  });
});
