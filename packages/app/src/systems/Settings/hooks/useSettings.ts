import { useInterpret, useSelector } from '@xstate/react';
import { useNavigate } from 'react-router-dom';
import { Pages } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';

import { settingsMachine } from '../machines';
import type { SettingsMachineState } from '../machines';

const selectors = {
  isChangingPassword: (state: SettingsMachineState) =>
    state.matches('changingPassword'),
  isUnlocking: (state: SettingsMachineState) => state.hasTag('unlocking'),
  error: (state: SettingsMachineState) => state.context.error,
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
  const error = useSelector(service, selectors.error);

  /** @description - This will change the password of the wallet */
  function changePassword(changePassword: VaultInputs['changePassword']) {
    send('CHANGE_PASSWORD', {
      input: changePassword,
    });
  }

  return {
    error,
    handlers: {
      changePassword,
    },
    isUnlocking,
    isChangingPassword,
  };
}
