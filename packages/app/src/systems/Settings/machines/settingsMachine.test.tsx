import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';

import { settingsMachine } from './settingsMachine';

import { expectStateMatch } from '~/systems/Core/__tests__';
import type { VaultInputs } from '~/systems/Vault';

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
  const redirectToWallet = jest.fn();
  let service: InterpreterFrom<typeof settingsMachine>;

  beforeEach(async () => {
    service = interpret(
      settingsMachine.withConfig({
        actions: {
          goToWallet: redirectToWallet,
        },
        services: {
          exportVault: () => Promise.resolve(WORDS),
          changePassword: () => Promise.resolve(),
        },
      })
    ).start();
  });

  it('should get mnemonic phrase', async () => {
    service.send('EXPORT_VAULT', {
      input: {
        password: '123123',
      },
    });
    await expectStateMatch(service, 'gettingMnemonic');
    const state = await expectStateMatch(service, 'done');

    expect(state.context.words.length).toBeGreaterThan(10);
  });

  it('should change the password of the user', async () => {
    service.send('CHANGE_PASSWORD', {
      currentPassword: '123123',
      password: '12345678',
    } as VaultInputs['changePassword']);

    await expectStateMatch(service, 'changingPassword');
    await expectStateMatch(service, 'passwordChanged');
    expect(redirectToWallet).toHaveBeenCalled();

    // Check if password was changed by changing the password again
    service.start();
    service.send('CHANGE_PASSWORD', {
      currentPassword: '12345678',
      password: '123123',
    } as VaultInputs['changePassword']);

    await expectStateMatch(service, 'changingPassword');
    await expectStateMatch(service, 'passwordChanged');
    expect(redirectToWallet).toHaveBeenCalled();
  });
});
