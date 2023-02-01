import type { AccountDialogMachineState } from '../machines';
import { AccountScreen } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  screen(state: AccountDialogMachineState) {
    return state.context.screen;
  },
  isOpened(state: AccountDialogMachineState) {
    return state.matches('opened');
  },
};

export function useAccountsDialog() {
  const screen = store.useSelector(Services.accountsDialog, selectors.screen);
  const isOpened = store.useSelector(
    Services.accountsDialog,
    selectors.isOpened
  );

  function goToList() {
    store.send(Services.accountsDialog, {
      type: 'GO_TO',
      input: AccountScreen.list,
    });
  }
  function goToAdd() {
    store.send(Services.accountsDialog, {
      type: 'GO_TO',
      input: AccountScreen.add,
    });
  }
  function closeModal() {
    store.send(Services.accountsDialog, {
      type: 'CLOSE_MODAL',
    });
  }

  return {
    screen,
    isOpened,
    handlers: {
      goToList,
      goToAdd,
      closeModal,
    },
  };
}
