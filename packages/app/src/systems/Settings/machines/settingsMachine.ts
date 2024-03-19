import { toast } from '@fuel-ui/react';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

type MachineContext = {
  error?: string;
};

type MachineEvents = {
  type: 'CHANGE_PASSWORD';
  input: VaultInputs['changePassword'];
};

export const settingsMachine = createMachine(
  {
    tsTypes: {} as import('./settingsMachine.typegen').Typegen0,
    schema: {
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: 'settingsMachine',
    initial: 'idle',
    context: {} as MachineContext,
    states: {
      idle: {
        tags: ['unlocking'],
        on: {
          CHANGE_PASSWORD: {
            target: 'changingPassword',
          },
        },
      },
      changingPassword: {
        entry: 'clearError',
        invoke: {
          data: {
            // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
            input: (_: void, ev: MachineEvents) => ev.input,
          },
          src: 'changePassword',
          onDone: [
            {
              cond: FetchMachine.hasError,
              actions: ['assignError'],
              target: 'idle',
            },
            {
              target: 'passwordChanged',
            },
          ],
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
      assignError: assign({
        error: 'Incorrect password',
      }),
      clearError: assign({
        error: undefined,
      }),
    },
    services: {
      changePassword: FetchMachine.create<VaultInputs['changePassword'], void>({
        showError: false,
        maxAttempts: 1,
        fetch: async ({ input }) => {
          if (!input?.currentPassword || !input.password) {
            throw new Error('Current and new password are required');
          }
          await VaultService.changePassword(input);
          toast.success('Password Changed');
        },
      }),
    },
  }
);

export type SettingsMachine = typeof settingsMachine;
export type SettingsMachineService = InterpreterFrom<typeof settingsMachine>;
export type SettingsMachineState = StateFrom<typeof settingsMachine>;
