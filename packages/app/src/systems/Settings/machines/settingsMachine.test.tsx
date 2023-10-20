import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { expectStateMatch } from '~/systems/Core/__tests__';
import type { VaultInputs } from '~/systems/Vault';

import { settingsMachine } from './settingsMachine';

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
          changePassword: () => Promise.resolve(),
        },
      })
    ).start();
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
