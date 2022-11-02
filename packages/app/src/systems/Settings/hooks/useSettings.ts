import { useInterpret, useSelector } from '@xstate/react';

import type { SettingsMachineState } from '../machines/settingsMachine';
import { settingsMachine } from '../machines/settingsMachine';

import { useAccount } from '~/systems/Account';

const selectors = {
  isUnlocking: (state: SettingsMachineState) =>
    state.matches('unlocking') || state.matches('gettingMnemonic'),
  words: (state: SettingsMachineState) => state.context.words,
};

export function useSettings() {
  const { account } = useAccount();
  const service = useInterpret(() => settingsMachine);
  const { send } = service;

  const isUnlocking = useSelector(service, selectors.isUnlocking);
  const words = useSelector(service, selectors.words);

  /** @description - This will unlock the wallet and get the mnemonic phrase */
  function unlockAndGetMnemonic(password: string) {
    send('UNLOCK_WALLET', { input: { password, account } });
  }

  return {
    unlockAndGetMnemonic,
    isUnlocking,
    words,
  };
}
