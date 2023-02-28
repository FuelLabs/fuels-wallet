import type {
  OverlayMachineState,
  OverlayKeys,
} from '../machines/overlayMachine';

import { Services, store } from '~/store';

const selectors = {
  isDialogOpen: (state: OverlayMachineState) =>
    state.matches('opened') && state.context.overlay !== 'sidebar',
  overlay(state: OverlayMachineState) {
    return state.matches('opened') && state.context.overlay;
  },
};

export function useOverlay() {
  const isDialogOpen = store.useSelector(
    Services.overlay,
    selectors.isDialogOpen
  );
  const overlay = store.useSelector(Services.overlay, selectors.overlay);

  function is(key: OverlayKeys | ((value: string) => boolean)) {
    return typeof key === 'function' ? key(overlay || '') : overlay === key;
  }

  return {
    is,
    isDialogOpen,
    overlay,
    open: store.openOverlay,
    close: store.closeOverlay,
  };
}
