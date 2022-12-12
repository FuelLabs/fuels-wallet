import { useInterpret, useSelector } from '@xstate/react';
import { useEffect } from 'react';

import type { ChainInfoMachineState } from '../machines/chainInfoMachine';
import { chainInfoMachine } from '../machines/chainInfoMachine';

const selectors = {
  context: (state: ChainInfoMachineState) => state.context,
};

export function useChainInfo(providerUrl?: string) {
  const service = useInterpret(() => chainInfoMachine);
  const { send } = service;
  const context = useSelector(service, selectors.context);

  const { chainInfo } = context;

  useEffect(() => {
    if (providerUrl) {
      send('FETCH_CHAIN_INFO', { input: { providerUrl } });
    }
  }, [providerUrl]);

  return { chainInfo };
}
