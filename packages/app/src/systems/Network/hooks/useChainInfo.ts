import { useInterpret, useSelector } from '@xstate/react';
import debounce from 'lodash.debounce';
import { useCallback, useEffect } from 'react';

import type { ChainInfoMachineState } from '../machines/chainInfoMachine';
import { chainInfoMachine } from '../machines/chainInfoMachine';

const selectors = {
  context: (state: ChainInfoMachineState) => state.context,
  loading: (state: ChainInfoMachineState) => state.hasTag('loading'),
};

export function useChainInfo(providerUrl?: string) {
  const service = useInterpret(() => chainInfoMachine);
  const { send } = service;
  const context = useSelector(service, selectors.context);
  const isLoading = useSelector(service, selectors.loading);

  const { chainInfo, error } = context;

  const fetchChainInfo = useCallback(
    debounce((url: string) => {
      send('FETCH_CHAIN_INFO', { input: { providerUrl: url } });
    }, 750),
    []
  );

  const clearChainInfo = useCallback(
    debounce(() => {
      send('CLEAR_CHAIN_INFO');
    }, 750),
    []
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (providerUrl) {
      fetchChainInfo(providerUrl);
    } else {
      send('CLEAR_CHAIN_INFO');
    }
  }, [providerUrl]);

  return {
    chainInfo,
    error,
    isLoading,
    handlers: { fetchChainInfo, clearChainInfo },
  };
}
