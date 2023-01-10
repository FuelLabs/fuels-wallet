import { useInterpret, useSelector } from '@xstate/react';
import { useNavigate } from 'react-router-dom';

import { settingsMachine } from '../machines';
import type { SettingsMachineState } from '../machines';

import type { AccountInputs } from '~/systems/Account';
import { useAccounts } from '~/systems/Account';
import { Pages } from '~/systems/Core';

const selectors = {
  words(state: SettingsMachineState) {
    return state.context.words;
  },
  waitingPass(state: SettingsMachineState) {
    return state.matches('idle');
  },
  isLoading(state: SettingsMachineState) {
    return state.hasTag('loading');
  },
};

export function useSettings() {
  const navigate = useNavigate();
  const { account } = useAccounts();
  const service = useInterpret(() =>
    settingsMachine.withConfig({
      actions: {
        goToWallet() {
          navigate(Pages.wallet());
        },
      },
    })
  );

  const words = useSelector(service, selectors.words);
  const waitingPass = useSelector(service, selectors.waitingPass);
  const isLoading = useSelector(service, selectors.isLoading);

  /** @description - This will change the password of the wallet */
  function changePassword(input: AccountInputs['changePassword']) {
    service.send('CHANGE_PASSWORD', { input });
  }
  function revealPassphrase(password: string) {
    service.send('REVEAL_PASSPHRASE', { input: { account, password } });
  }
  function goBack() {
    navigate(Pages.wallet());
  }

  return {
    words,
    waitingPass,
    isLoading,
    handlers: {
      changePassword,
      revealPassphrase,
      goBack,
    },
  };
}
