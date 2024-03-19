import { useEffect } from 'react';
import { Services, store } from '~/store';
import { VaultService } from '~/systems/Vault';

import type { UnlockMachineState } from '../machines';

const selectors = {
  error(state: UnlockMachineState) {
    return state.context.error;
  },
  isLoading(state: UnlockMachineState) {
    return state.hasTag('loading');
  },
  isUnlocked(state: UnlockMachineState) {
    return state.matches('unlocked');
  },
  isReseting(state: UnlockMachineState) {
    return state.matches('reseting');
  },
};

export function useUnlock() {
  const error = store.useSelector(Services.unlock, selectors.error);
  const isLoading = store.useSelector(Services.unlock, selectors.isLoading);
  const isUnlocked = store.useSelector(Services.unlock, selectors.isUnlocked);
  const isReseting = store.useSelector(Services.unlock, selectors.isReseting);

  // Lock Wallet when Vault is locked
  useEffect(() => {
    const onLock = () => {
      store.checkLock();
    };
    VaultService.on('lock', onLock);
    return () => {
      VaultService.off('lock', onLock);
    };
  }, []);

  store.useUpdateMachineConfig(Services.unlock, {
    actions: {
      reload: () => window.location.reload(),
    },
  });

  function reset() {
    store.send(Services.unlock, {
      type: 'RESET_WALLET',
    });
  }

  return {
    error,
    isLoading,
    isUnlocked,
    isReseting,
    handlers: {
      unlock: store.unlock,
      lock: store.lock,
      reset,
    },
  };
}
