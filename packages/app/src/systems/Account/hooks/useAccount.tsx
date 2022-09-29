import type { StateOf } from '@fuels-wallet/xstore';

import type { Store } from '~/store';
import { Services, useStoreService, useStoreSelector } from '~/store';

const selectors = {
  isLoading: (state: StateOf<Services.account, Store>) => {
    return state.hasTag('loading');
  },
  account: (state: StateOf<Services.account, Store>) => {
    return state.context?.data;
  },
};

export function useAccount() {
  const service = useStoreService(Services.account);
  const isLoading = useStoreSelector(service, selectors.isLoading);
  const account = useStoreSelector(service, selectors.account);

  return {
    isLoading,
    account,
  };
}
