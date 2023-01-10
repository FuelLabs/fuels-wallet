import type { UnlockMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  unlockError: (state: UnlockMachineState) => {
    return state.context?.response?.error;
  },
  isUnlocking: (state: UnlockMachineState) => {
    return state.hasTag('opened');
  },
  isUnlockingLoading: (state: UnlockMachineState) => {
    return state.hasTag('loading');
  },
  isUnlocked: (state: UnlockMachineState) => {
    return state.matches('unlocked');
  },
};

export function useUnlock() {
  const unlockError = store.useSelector(Services.unlock, selectors.unlockError);
  const isUnlocking = store.useSelector(Services.unlock, selectors.isUnlocking);
  const isUnlocked = store.useSelector(Services.unlock, selectors.isUnlocked);
  const isUnlockingLoading = store.useSelector(
    Services.unlock,
    selectors.isUnlockingLoading
  );

  console.log(store.getSnapshot(Services.unlock).value);
  console.log(store.getSnapshot(Services.unlock).context);

  return {
    unlockError,
    isUnlocking,
    isUnlockingLoading,
    isUnlocked,
  };
}
