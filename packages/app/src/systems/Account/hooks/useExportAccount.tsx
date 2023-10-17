import { useMachine, useSelector } from '@xstate/react';
import type { ExportAccountMachineState } from '~/systems/Account';
import { exportAccountMachine } from '~/systems/Account';
import { useOverlay } from '~/systems/Overlay';

const selectors = {
  account: (state: ExportAccountMachineState) => state.context?.account,
  isLoading: (state: ExportAccountMachineState) => state.hasTag('loading'),
  exportedKey: (state: ExportAccountMachineState) => state.context.exportedKey,
  isUnlockOpened: (state: ExportAccountMachineState) =>
    state.hasTag('unlockOpened'),
  error: (state: ExportAccountMachineState) => state.context.error,
};

export function useExportAccount() {
  const { metadata: address } = useOverlay<string>();
  const [, , service] = useMachine(
    exportAccountMachine.withContext({
      address,
    })
  );

  const isLoading = useSelector(service, selectors.isLoading);
  const error = useSelector(service, selectors.error);
  const account = useSelector(service, selectors.account);
  const exportedKey = useSelector(service, selectors.exportedKey);
  const isUnlockOpened = useSelector(service, selectors.isUnlockOpened);

  function exportAccount(password: string) {
    service.send({
      type: 'EXPORT_ACCOUNT',
      input: {
        password,
      },
    });
  }

  return {
    handlers: {
      exportAccount,
    },
    account,
    exportedKey,
    isLoading,
    error,
    isUnlockOpened,
  };
}
