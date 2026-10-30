import { useInterpret, useSelector } from '@xstate/react';

import { VaultService } from '~/systems/Vault';
import type { ExportVaultMachineState } from '../machines';
import { exportVaultMachine } from '../machines';

const selectors = {
  isLoading: (state: ExportVaultMachineState) => state.hasTag('loading'),
  words: (state: ExportVaultMachineState) => state.context.words,
  isUnlockOpened: (state: ExportVaultMachineState) =>
    state.hasTag('unlockOpened'),
  error: (state: ExportVaultMachineState) => state.context.error,
};

export function useExportVault(vaultId?: number) {
  const service = useInterpret(() => exportVaultMachine);
  const isLoading = useSelector(service, selectors.isLoading);
  const error = useSelector(service, selectors.error);
  const words = useSelector(service, selectors.words);
  const isUnlockOpened = useSelector(service, selectors.isUnlockOpened);

  async function exportVault(password: string) {
    if (await VaultService.isLocked()) {
      await VaultService.unlock({ password });
    }

    let targetVaultId = vaultId;

    // If no specific vaultId provided, use the first vault (main wallet behavior)
    if (targetVaultId === undefined) {
      const [vault] = await VaultService.getVaults();
      targetVaultId = vault?.vaultId;
    }

    if (targetVaultId !== undefined) {
      service.send({
        type: 'EXPORT_VAULT',
        input: {
          password,
          vaultId: targetVaultId,
        },
      });
    }
  }

  return {
    handlers: {
      exportVault,
    },
    words,
    isLoading,
    error,
    isUnlockOpened,
  };
}
