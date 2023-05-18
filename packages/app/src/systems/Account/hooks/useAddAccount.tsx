import { useMachine, useSelector } from '@xstate/react';

import type { AddAccountMachineState } from '../machines';
import { addAccountMachine } from '../machines';

const selectors = {
  accountName: (state: AddAccountMachineState) => state.context?.accountName,
  isLoading: (state: AddAccountMachineState) => state.hasTag('loading'),
};

export function useAddAccount() {
  const [, send, service] = useMachine(addAccountMachine);

  const accountName = useSelector(service, selectors.accountName);
  const isLoading = useSelector(service, selectors.isLoading);
  const addAccount = () => {
    send('ADD_ACCOUNT');
  };

  return {
    handlers: {
      addAccount,
    },
    accountName,
    isLoading,
  };
}
