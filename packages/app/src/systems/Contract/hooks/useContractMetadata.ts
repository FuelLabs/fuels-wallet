import type { Contract } from '@fuel-wallet/types';
import { useEffect } from 'react';
import { Services, store } from '~/store';
import type { ContractsMachineState } from '../machines/contractsMachine';

const selectors = {
  contract(id: string) {
    return (state: ContractsMachineState): Contract | undefined => {
      return state.context.contracts?.find(
        (contract) => contract.contractId === id
      );
    };
  },
};

export const useContractMetadata = (id: string): Contract | undefined => {
  useEffect(() => {
    store.send(Services.contracts, { type: 'FETCH' });
  }, []);

  const contract = store.useSelector(
    Services.contracts,
    selectors.contract(id)
  );

  return contract;
};
