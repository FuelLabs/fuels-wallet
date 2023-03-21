import { useMachine, useSelector } from '@xstate/react';

import type { ExportAccountMachineState } from '~/systems/Account';
import { exportAccountMachine } from '~/systems/Account';
import { useOverlay } from '~/systems/Overlay';

const selectors = {
  account: (state: ExportAccountMachineState) => state.context?.account,
  isLoading: (state: ExportAccountMachineState) => state.hasTag('loading'),
  exportedKey: (state: ExportAccountMachineState) => state.context.exportedKey,
};

export function useExportAccount() {
  const { metadata: address } = useOverlay<string>();
  const [, , service] = useMachine(
    exportAccountMachine.withContext({
      address,
    })
  );

  const isLoading = useSelector(service, selectors.isLoading);
  const account = useSelector(service, selectors.account);
  const exportedKey = useSelector(service, selectors.exportedKey);

  return {
    account,
    exportedKey,
    isLoading,
  };
}
