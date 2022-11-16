/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WalletUnlocked } from '@fuel-ts/wallet';
import type { InterpreterFrom, StateFrom, TransitionConfig } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '~/systems/Account';
import { AccountService } from '~/systems/Account';
import { FetchMachine } from '~/systems/Core';

export type UnlockMachineContext = Record<string, never>;

type MachineServices = {
  unlock: {
    data: WalletUnlocked;
  };
};

export type UnlockMachineEvents = {
  type: 'UNLOCK_WALLET';
  input: AccountInputs['unlock'];
};

export const unlockMachineError = (_: any, ev: { data: { error?: any } }) => {
  return Boolean(ev.data?.error);
};

export const unlockMachineErrorAction = (
  state: string,
  field: string
): TransitionConfig<any, any> => {
  return {
    cond: FetchMachine.hasError,
    target: state,
    actions: [
      assign((ctx: any, ev: { data: { error?: any } }) => ({
        ...ctx,
        [field || 'error']: ev.data.error.message,
      })),
    ],
  };
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
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              target: 'done',
            },
          ],
        },
      },
      failed: {
        type: 'final',
        data: (_, ev: { data: Error }) => ev.data,
      },
      done: {
        type: 'final',
        data: (_, e: { data: WalletUnlocked }) => e.data,
      },
    },
  },
  {
    services: {
      unlock: FetchMachine.create<AccountInputs['unlock'], WalletUnlocked>({
        showError: false,
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input || !input?.password) {
            throw new Error('Password is required to unlock wallet');
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
