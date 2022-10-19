import type { Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { createMachine } from 'xstate';

import type { AccountInputs } from '~/systems/Account';
import { AccountService } from '~/systems/Account';
import { FetchMachine } from '~/systems/Core';

export type UnlockMachineContext = Record<string, never>;

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
        invoke: {
          src: 'unlock',
          data: {
            input: (_: UnlockMachineContext, ev: UnlockMachineEvents) =>
              ev.input,
          },
          onDone: [
            {
              target: 'waitingPassword',
              cond: FetchMachine.hasError,
            },
            {
              target: 'done',
            },
          ],
          onError: {
            target: 'waitingPassword',
          },
        },
      },
      done: {
        type: 'final',
        data: (_, e: { data: Wallet }) => e.data,
      },
    },
  },
  {
    services: {
      unlock: FetchMachine.create<AccountInputs['unlock'], Wallet>({
        showError: true,
        maxAttempts: 1,
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
