import type { StateOf } from '@fuels-wallet/xstore';
import { useCallback } from 'react';

import { SideBarActionTypes, SideBarStateValues } from '../machines';

import type { Store } from '~/store';
import { Services, useStoreSelector, useStoreService } from '~/store';

type State = StateOf<Services.account, Store>;

const selectors = {
  isOpen: (state: State) => {
    return state.value === SideBarStateValues.Expanded;
  },
};

export function useSideBar() {
  const service = useStoreService(Services.sidebar);

  const toggle = useCallback(() => {
    service.send({
      type: SideBarActionTypes.TOGGLE,
    });
  }, [service]);

  return {
    isSideBarOpen: useStoreSelector(service, selectors.isOpen),
    toggle,
  };
}
