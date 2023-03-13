import type { UnlockMachineState } from '../machines';

import { store, Services } from '~/store';
import { continueSignUpLink } from '~/systems/CRX';
import { openTab } from '~/systems/CRX/utils';
import { useIsSigningUp } from '~/systems/Core/hooks/useIsSigningUp';

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

  store.useUpdateMachineConfig(Services.unlock, {
    actions: {
      reload: () => window.location.reload(),
      onUnlock: () => {
        const isSigningUp = useIsSigningUp();
        if (isSigningUp) {
          openTab(continueSignUpLink());
        }
      },
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
