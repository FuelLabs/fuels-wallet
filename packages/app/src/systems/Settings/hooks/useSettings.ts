import { useInterpret, useSelector } from '@xstate/react';
import { useNavigate } from 'react-router-dom';

import { settingsMachine } from '../machines';
import type { SettingsMachineState } from '../machines';

import { Pages } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';

const selectors = {
  isChangingPassword: (state: SettingsMachineState) =>
    state.matches('changingPassword'),
  isUnlocking: (state: SettingsMachineState) => state.hasTag('unlocking'),
};

export function useSettings() {
  const navigate = useNavigate();
  const service = useInterpret(() =>
    settingsMachine.withConfig({
      actions: {
        goToWallet() {
          navigate(Pages.wallet());
        },
      },
    })
  );
  const { send } = service;
  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const isChangingPassword = useSelector(service, selectors.isChangingPassword);

  /** @description - This will change the password of the wallet */
  function changePassword(changePassword: VaultInputs['changePassword']) {
    send('CHANGE_PASSWORD', {
      input: changePassword,
    });
  }

  return {
    handlers: {
      changePassword,
    },
    isUnlocking,
    isChangingPassword,
  };
}
