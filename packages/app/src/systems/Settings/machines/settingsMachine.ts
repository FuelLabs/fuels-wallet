import { toast } from '@fuel-ui/react';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '~/systems/Account';
import { AccountService } from '~/systems/Account';
import type { ChildrenMachine } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';
import type { UnlockMachine } from '~/systems/DApp';

type MachineServices = {
  getMnemonicPhrase: {
    data: string[];
  };
};

type MachineContext = {
  words: string[];
};

type MachineEvents = {
  type: 'UNLOCK_WALLET' | 'CHANGE_PASSWORD';
  input?: AccountInputs['unlock'];
  data?: string[];
};

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
    id: '(machine)',
    initial: 'unlocking',
    states: {
      changingPassword: {
        invoke: {
          src: 'changePassword',
          data: (_: MachineContext, ev: MachineEvents) => {
            return { input: ev.input };
          },
          onDone: [
            {
              target: 'unlocking',
              cond: FetchMachine.hasError,
            },
            {
              target: 'passwordChanged',
            },
          ],
        },
      },
      unlocking: {
        on: {
          UNLOCK_WALLET: {
            target: 'gettingMnemonic',
          },
        },
      },
      gettingMnemonic: {
        invoke: {
          src: 'unlockAndGetMnemonic',
          data: {
            input: (_: MachineContext, ev: MachineEvents) => {
              return ev.input;
            },
          },
          onDone: [
            {
              target: 'unlocking',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignWords'],
              target: 'done',
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
      failed: {},
    },
    on: {
      CHANGE_PASSWORD: {
        target: 'changingPassword',
      },
    },
  },
  {
    actions: {
      assignWords: assign({
        words: (_, ev) => ev.data as string[],
      }),
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

          await AccountService.changePassword({
            oldPassword: input.oldPassword,
            newPassword: input.newPassword,
          });
          toast.success('Password Changed');
        },
      }),
      unlockAndGetMnemonic: FetchMachine.create<
        AccountInputs['unlock'],
        string[]
      >({
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

          return secret?.split(' ') as string[];
        },
      }),
    },
  }
);

export type SettingsMachine = typeof settingsMachine;
export type SettingsMachineService = InterpreterFrom<typeof settingsMachine>;
export type SettingsMachineState = StateFrom<typeof settingsMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
