import type { Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { send } from 'xstate/lib/actions';

import type { AccountInputs, AccountService } from '~/systems/Account';
import type { ChildrenMachine } from '~/systems/Core';
import { FetchMachine } from '~/systems/Core';
import type { UnlockMachine } from '~/systems/DApp';
import { unlockMachine } from '~/systems/DApp';

type MachineServices = {
  getMnemonicPhrase: {
    data: string[];
  };
};

type MachineContext = {
  words: string[];
};

type MachineEvents = {
  type: 'UNLOCK_WALLET' | 'CLOSE_UNLOCK';
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
    id: '(settings-machine)',
    initial: 'unlocking',
    states: {
      unlocking: {
        invoke: {
          id: 'unlock',
          src: unlockMachine,
          data: (_: MachineContext, ev: MachineEvents) => {
            return ev.input;
          },
          onDone: {
            target: 'gettingMnemonic',
          },
        },
        on: {
          UNLOCK_WALLET: {
            // send to the child machine
            actions: [
              send<MachineContext, MachineEvents>(
                (_, ev) => ({
                  type: 'UNLOCK_WALLET',
                  input: ev.input,
                }),
                { to: 'unlock' }
              ),
            ],
          },
        },
      },
      gettingMnemonic: {
        invoke: {
          src: 'getMnenmonic',
          data: {
            input: (_: MachineContext, ev: { data: Wallet }) => {
              return { wallet: ev.data };
            },
          },
          onDone: [
            {
              target: 'done',
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
      getMnenmonic: FetchMachine.create<
        {
          wallet: Awaited<ReturnType<typeof AccountService['unlock']>>;
        },
        unknown
      >({
        showError: true,
        maxAttempts: 1,
        fetch: async ({ input }) => {
          if (!input?.wallet?.exportVault) {
            throw new Error('Invalid Wallet');
          }
          return input.wallet.exportVault().split(' ');
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
