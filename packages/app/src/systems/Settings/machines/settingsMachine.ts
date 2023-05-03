import { toast } from '@fuel-ui/react';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

import { FetchMachine } from '~/systems/Core';
import type { VaultInputs } from '~/systems/Vault';
import { VaultService } from '~/systems/Vault';

type MachineEvents = {
  type: 'CHANGE_PASSWORD';
  input: VaultInputs['changePassword'];
};

export const settingsMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./settingsMachine.typegen').Typegen0,
    schema: {
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: 'settingsMachine',
    initial: 'idle',
    context: {
      words: [],
    },
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
        invoke: {
          data: {
            input: (_: void, ev: MachineEvents) => ev.input,
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
    },
  }
);

export type SettingsMachine = typeof settingsMachine;
export type SettingsMachineService = InterpreterFrom<typeof settingsMachine>;
export type SettingsMachineState = StateFrom<typeof settingsMachine>;
