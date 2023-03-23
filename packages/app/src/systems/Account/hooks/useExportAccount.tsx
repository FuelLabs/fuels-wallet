import { useMachine, useSelector } from '@xstate/react';

import type { ExportAccountMachineState } from '~/systems/Account';
import { exportAccountMachine } from '~/systems/Account';
import { useOverlay } from '~/systems/Overlay';

const selectors = {
  account: (state: ExportAccountMachineState) => state.context?.account,
  isLoading: (state: ExportAccountMachineState) => state.hasTag('loading'),
  exportedKey: (state: ExportAccountMachineState) => state.context.exportedKey,
  isWaitingPassword: (state: ExportAccountMachineState) =>
    state.matches('waitingPassword'),
  isFailed: (state: ExportAccountMachineState) => state.matches('failed'),
};

export function useExportAccount() {
  const { metadata: address } = useOverlay<string>();
  const [, , service] = useMachine(
    exportAccountMachine.withContext({
      address,
    })
  );

  const isLoading = useSelector(service, selectors.isLoading);
  const isFailed = useSelector(service, selectors.isFailed);
  const account = useSelector(service, selectors.account);
  const exportedKey = useSelector(service, selectors.exportedKey);
  const isWaitingPassword = useSelector(service, selectors.isWaitingPassword);

  function exportAccount(password: string) {
    service.send({
      type: 'EXPORT_ACCOUNT',
      input: {
        password,
      },
    });
  }

  function retry() {
    service.send({
      type: 'RETRY',
    });
  }

  return {
    handlers: {
      exportAccount,
      retry,
    },
    account,
    exportedKey,
    isLoading,
    isFailed,
    isWaitingPassword,
  };
}
