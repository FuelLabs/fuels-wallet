import { useSelector } from '@xstate/react';
import { Services, store } from '~/store';
import type { NameSystemInput } from '~/systems/NameSystem/services';
import { useNetworks } from '~/systems/Network';
import type { NameSystemRequestState } from '../machines/nameSystemRequetMachine';

const selectors = {
  name(state: NameSystemRequestState) {
    return state.context.name;
  },
  address(state: NameSystemRequestState) {
    return state.context.address;
  },
  error(state: NameSystemRequestState) {
    return state.context.error;
  },
  isOpenDropdown(state: NameSystemRequestState) {
    return state.context.isDropdownOpen;
  },
  isResolvingDomain(state: NameSystemRequestState) {
    return state.matches('loadingDomain');
  },
};

export type UseNameSystemRequestReturn = ReturnType<
  typeof useNameSystemRequest
>;

type SetDomain = {
  domain: string;
  address: string;
};

export function useNameSystemRequest() {
  const { network } = useNetworks();
  const service = store.useService(Services.nameSystemRequest);
  const domain = useSelector(service, selectors.name);
  const address = useSelector(service, selectors.address);
  const error = useSelector(service, selectors.error);
  const isResolvingDomain = useSelector(service, selectors.isResolvingDomain);
  const isOpenDropdown = useSelector(service, selectors.isOpenDropdown);

  function resolverDomain(
    input: Omit<NameSystemInput['resolverDomain'], 'chainId'>
  ) {
    if (!network) throw new Error('Network not available');
    service.send('RESOLVE_DOMAIN', { ...input, chainId: network.chainId });
  }

  function retry() {
    service.send('RETRY');
  }

  function toggleDropdown(open: boolean) {
    service.send('TOGGLE_DROPDOWN', { open });
  }

  function setDomain(input: Omit<SetDomain, 'chainId'>) {
    service.send('SET_DOMAIN', { ...input, chainId: network?.chainId });
  }

  function reset() {
    service.send('RESET');
  }

  return {
    resolverDomain,
    retry,
    reset,
    setDomain,
    domain,
    address,
    error,
    isResolvingDomain,
    toggleDropdown,
    isOpenDropdown,
  };
}
