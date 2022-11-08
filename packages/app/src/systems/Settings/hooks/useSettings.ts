import { useInterpret, useSelector } from '@xstate/react';

import type { SettingsMachineState } from '../machines/settingsMachine';
import { settingsMachine } from '../machines/settingsMachine';

import type { AccountInputs } from '~/systems/Account';
import { useAccount } from '~/systems/Account';

const selectors = {
  isChangingPassword: (state: SettingsMachineState) =>
    state.matches('changingPassword'),

  hasChangedPassword: (state: SettingsMachineState) => state.matches('done'),

  isUnlocking: (state: SettingsMachineState) =>
    state.matches('unlocking') || state.matches('gettingMnemonic'),

  words: (state: SettingsMachineState) => state.context.words,
};

export function useSettings() {
  const { account } = useAccount();
  const service = useInterpret(() => settingsMachine);
  const { send } = service;

  const isUnlocking = useSelector(service, selectors.isUnlocking);

  const isChangingPassword = useSelector(service, selectors.isChangingPassword);

  const hasChangedPassword = useSelector(service, selectors.hasChangedPassword);

  const words = useSelector(service, selectors.words);

  /** @description - This will unlock the wallet and get the mnemonic phrase */
  function unlockAndGetMnemonic(password: string) {
    send('UNLOCK_WALLET', { input: { password, account } });
  }

  /** @description - This will change the password of the wallet */
  function changePassword(params: AccountInputs['changePassword']) {
    send('CHANGE_PASSWORD', {
      input: {
        oldPassword: params.oldPassword,
        newPassword: params.newPassword,
      },
    });
  }

  return {
    changePassword,
    unlockAndGetMnemonic,
    isUnlocking,
    isChangingPassword,
    words,
    hasChangedPassword,
  };
}
