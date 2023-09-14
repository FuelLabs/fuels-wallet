import { useMachine, useSelector } from '@xstate/react';
import type { AccountInputs } from '~/systems/Account';
import { useOverlay } from '~/systems/Overlay';

import type { EditAccountMachineState } from '../machines';
import { editAccountMachine } from '../machines';

const selectors = {
  account: (state: EditAccountMachineState) => state.context?.account,
  isLoading: (state: EditAccountMachineState) => state.hasTag('loading'),
};

export function useEditAccount() {
  const { metadata: address } = useOverlay<string>();
  const [, send, service] = useMachine(() =>
    editAccountMachine.withContext({
      address,
    })
  );

  const account = useSelector(service, selectors.account);
  const isLoading = useSelector(service, selectors.isLoading);

  const updateAccountName = (input: AccountInputs['updateAccount']) => {
    send('UPDATE_ACCOUNT', { input });
  };

  return {
    handlers: {
      updateAccountName,
    },
    account,
    isLoading,
  };
}
