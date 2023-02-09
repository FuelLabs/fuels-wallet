import type {
  OverlayMachineState,
  OverlayKeys,
} from '../machines/overlayMachine';

import { Services, store } from '~/store';

const selectors = {
  overlay(state: OverlayMachineState) {
    return state.context.overlay;
  },
};

export function useOverlay() {
  const overlay = store.useSelector(Services.overlay, selectors.overlay);
  function is(key: OverlayKeys | ((value: string) => boolean)) {
    return typeof key === 'function' ? key(overlay || '') : overlay === key;
  }

  return {
    is,
    overlay,
    open: store.openOverlay,
    close: store.closeOverlay,
  };
}
