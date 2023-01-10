import { toast } from '@fuel-ui/react';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { store } from '~/store';
import { AccountService } from '~/systems/Account';
import type { AccountInputs } from '~/systems/Account';
import { FetchMachine } from '~/systems/Core';

type MachineServices = {
  getMnemonic: {
    data: string[];
  };
};

type MachineContext = {
  words?: string[];
};

type MachineEvents =
  | { type: 'CHANGE_PASSWORD'; input: AccountInputs['changePassword'] }
  | { type: 'REVEAL_PASSPHRASE'; input: AccountInputs['unlock'] };

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
    states: {
      idle: {
        on: {
          REVEAL_PASSPHRASE: {
            target: 'gettingMnemonic',
          },
          CHANGE_PASSWORD: {
            target: 'changingPassword',
          },
        },
      },
      changingPassword: {
        tags: ['loading'],
        invoke: {
          src: 'changePassword',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => ev.input,
          },
          onDone: [
            {
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              target: 'done',
              actions: ['goToWallet', 'passwordChangeSuccess'],
            },
          ],
        },
      },
      gettingMnemonic: {
        tags: ['loading'],
        invoke: {
          src: 'getMnemonic',
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
    },
  },
  {
    actions: {
      assignWords: assign({
        words: (_, ev) => ev.data,
      }),
      passwordChangeSuccess: () => {
        toast.success('Password Changed');
        store.resetUnlock();
      },
    },
    services: {
      changePassword: FetchMachine.create<
        AccountInputs['changePassword'],
        void
      >({
        showError: true,
        maxAttempts: 1,
        fetch: async ({ input }) => {
          if (!input?.oldPassword || !input.newPassword) {
            throw new Error('Invalid Input');
          }
          return AccountService.changePassword({
            oldPassword: input.oldPassword,
            newPassword: input.newPassword,
          });
        },
      }),
      getMnemonic: FetchMachine.create<AccountInputs['unlock'], string[]>({
        showError: true,
        maxAttempts: 1,
        fetch: async ({ input }) => {
          if (!input?.account || !input.password) {
            throw new Error('Invalid Input');
          }
          const secret = await AccountService.exportVault(input);
          if (!secret) {
            throw new Error('No Secret Found');
          }
          return secret.split(' ');
        },
      }),
    },
  }
);

export type SettingsMachine = typeof settingsMachine;
export type SettingsMachineService = InterpreterFrom<typeof settingsMachine>;
export type SettingsMachineState = StateFrom<typeof settingsMachine>;
