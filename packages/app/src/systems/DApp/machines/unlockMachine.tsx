import type { Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { sendParent, createMachine } from 'xstate';

import type { Account, AccountInputs } from '~/systems/Account';
import { AccountService } from '~/systems/Account';
import { FetchMachine } from '~/systems/Core';

export type UnlockMachineContext = {
  account?: Account;
  password?: string;
};

type MachineServices = {
  unlock: {
    data: Wallet;
  };
};

export type UnlockMachineEvents = {
  type: 'UNLOCK_WALLET';
  input: AccountInputs['unlock'];
};

export const unlockMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./unlockMachine.typegen').Typegen0,
    schema: {
      context: {} as UnlockMachineContext,
      services: {} as MachineServices,
      events: {} as UnlockMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'waitingPassword',
    states: {
      waitingPassword: {
        on: {
          UNLOCK_WALLET: {
            target: 'unlocking',
          },
        },
      },
      unlocking: {
        tags: ['loading'],
        entry: sendParent('START_LOADING_UNLOCK'),
        invoke: {
          src: 'unlock',
          data: {
            input: (_: UnlockMachineContext, ev: UnlockMachineEvents) =>
              ev.input,
          },
          onDone: [
            {
              target: 'done',
              cond: FetchMachine.hasError,
            },
            {
              target: 'done',
            },
          ],
        },
      },
      done: {
        type: 'final',
        data: (_, e: { data: Wallet }) => e.data,
      },
      failed: {},
    },
  },
  {
    services: {
      unlock: FetchMachine.create<AccountInputs['unlock'], Wallet>({
        showError: true,
        async fetch({ input }) {
          if (!input || !input?.password) {
            throw new Error('Invalid network input');
          }
          return AccountService.unlock(input);
        },
      }),
    },
  }
);

export type UnlockMachine = typeof unlockMachine;
export type UnlockMachineService = InterpreterFrom<typeof unlockMachine>;
export type UnlockMachineState = StateFrom<typeof unlockMachine>;
