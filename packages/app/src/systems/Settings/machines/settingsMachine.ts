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
  type: 'UNLOCK_WALLET';
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
      failed: {},
    },
  },
  {
    actions: {
      assignWords: assign({
        words: (_, ev) => ev.data as string[],
      }),
    },
    services: {
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
