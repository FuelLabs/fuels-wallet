import { toast } from '@fuel-ui/react';
import { useInterpret, useSelector } from '@xstate/react';
import { useNavigate } from 'react-router-dom';

import type { SettingsMachineState } from '../machines/settingsMachine';
import { settingsMachine } from '../machines/settingsMachine';

import type { AccountInputs } from '~/systems/Account';
import { useAccount } from '~/systems/Account';
import { Pages } from '~/systems/Core';

const selectors = {
  isChangingPassword: (state: SettingsMachineState) =>
    state.matches('changingPassword'),
  isUnlocking: (state: SettingsMachineState) => state.hasTag('unlocking'),
  isGettingMnemonic: (state: SettingsMachineState) =>
    state.matches('gettingMnemonic'),
  words: (state: SettingsMachineState) => state.context.words,
};

export function useSettings() {
  const navigate = useNavigate();
  const { account } = useAccount();
  const service = useInterpret(() =>
    settingsMachine.withConfig({
      actions: {
        goToWallet() {
          toast.success('Password Changed');
          navigate(Pages.wallet());
        },
      },
    })
  );
  const { send } = service;
  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isChangingPassword = useSelector(service, selectors.isChangingPassword);
  const isGettingMnemonic = useSelector(service, selectors.isGettingMnemonic);
  const words = useSelector(service, selectors.words);

  /** @description - This will unlock the wallet and get the mnemonic phrase */
  function unlockAndGetMnemonic(password: string) {
    send('UNLOCK_WALLET', { input: { password, account } });
  }

  /** @description - This will change the password of the wallet */
  function changePassword(changePassword: AccountInputs['changePassword']) {
    send('CHANGE_PASSWORD', {
      input: changePassword,
    });
  }

  return {
    changePassword,
    unlockAndGetMnemonic,
    isUnlocking,
    isChangingPassword,
    isGettingMnemonic,
    words,
  };
}
