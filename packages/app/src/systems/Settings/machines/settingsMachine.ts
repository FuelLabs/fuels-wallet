import { toast } from '@fuel-ui/react';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { FetchMachine } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

type MachineServices = {
  exportVault: {
    data: string[];
  };
};

type MachineContext = {
  words: string[];
};

type MachineEvents =
  | { type: 'EXPORT_VAULT'; input: VaultInputs['exportVault'] }
  | { type: 'CHANGE_PASSWORD'; input: VaultInputs['changePassword'] };

export const settingsMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./settingsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: 'settingsMachine',
    initial: 'idle',
    context: {
      words: [],
    },
    states: {
      changingPassword: {
        invoke: {
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          src: 'changePassword',
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              target: 'passwordChanged',
            },
          ],
        },
      },
      idle: {
        tags: ['unlocking'],
        on: {
          CHANGE_PASSWORD: {
            target: 'changingPassword',
          },
          EXPORT_VAULT: {
            target: 'gettingMnemonic',
          },
        },
      },
      gettingMnemonic: {
        tags: ['unlocking'],
        invoke: {
          src: 'exportVault',
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignWords'],
              target: 'done',
            },
          ],
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
        },
      },
      done: {
        type: 'final',
      },
      passwordChanged: {
        type: 'final',
        entry: 'goToWallet',
      },
    },
  },
  {
    actions: {
      assignWords: assign({
        words: (_, ev) => ev.data,
      }),
    },
    services: {
      changePassword: FetchMachine.create<VaultInputs['changePassword'], void>({
        showError: true,
        maxAttempts: 1,
        fetch: async ({ input }) => {
          if (!input?.currentPassword || !input.password) {
            throw new Error('Invalid Input');
          }
          await VaultService.changePassword(input);
          toast.success('Password Changed');
        },
      }),
      exportVault: FetchMachine.create<VaultInputs['exportVault'], string[]>({
        showError: true,
        maxAttempts: 1,
        fetch: async ({ input }) => {
          if (!input?.password) {
            throw new Error('Password is required to export Vault!');
          }
          const secret = await VaultService.exportVault({
            ...input,
            vaultId: 0,
          });
          return secret.split(' ');
        },
      }),
    },
  }
);

export type SettingsMachine = typeof settingsMachine;
export type SettingsMachineService = InterpreterFrom<typeof settingsMachine>;
export type SettingsMachineState = StateFrom<typeof settingsMachine>;
