import type { Account } from '@fuel-wallet/types';
import type { WalletUnlocked } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { send, assign, createMachine } from 'xstate';

import {
  unlockMachineErrorAction,
  unlockMachine,
  AccountService,
} from '~/systems/Account';
import type {
  UnlockMachine,
  AccountInputs,
  UnlockWalletEvent,
} from '~/systems/Account';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { ChildrenMachine } from '~/systems/Core';

type MachineContext = {
  account?: Account;
  message?: string;
  address?: string;
  origin?: string;
  error?: string;
  unlockError?: string;
  signedMessage?: string;
};

type MachineServices = {
  signMessage: {
    data: string;
  };
  fetchAccount: {
    data: Account;
  };
};

type MachineEvents =
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] }
  | {
      type: 'START_SIGN';
      input: { origin: string; message: string; address: string };
    }
  | { type: 'CLOSE_UNLOCK' }
  | { type: 'SIGN_MESSAGE' }
  | { type: 'REJECT' };

export const signMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./signMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START_SIGN: {
            actions: ['assignSignData'],
            target: 'fetchingAccount',
          },
        },
        after: {
          /** connection should start quickly, if not, it's probably an error or reloading.
           * to avoid stuck black screen, should close the window and let user retry */
          TIMEOUT: '#(machine).closing', // retry
        },
      },
      closing: {
        entry: ['closeWindow'],
        always: {
          target: '#(machine).failed',
        },
      },
      fetchingAccount: {
        invoke: {
          src: 'fetchAccount',
          data: {
            input: (ctx: MachineContext) => ({ address: ctx.address }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['assignAccount'],
              target: 'reviewMessage',
            },
          ],
        },
      },
      reviewMessage: {
        on: {
          SIGN_MESSAGE: {
            target: 'unlocking',
          },
          REJECT: {
            actions: [assignErrorMessage('Rejected request!')],
            target: 'failed',
          },
        },
      },
      unlocking: {
        invoke: {
          id: 'unlock',
          src: 'unlock',
          onDone: [
            unlockMachineErrorAction('unlocking', 'unlockError'),
            {
              target: 'signingMessage',
            },
          ],
        },
        on: {
          UNLOCK_WALLET: {
            // send to the child machine
            actions: [
              send<MachineContext, UnlockWalletEvent>(
                (_, ev) => ({
                  type: 'UNLOCK_WALLET',
                  input: ev.input,
                }),
                { to: 'unlock' }
              ),
            ],
          },
          CLOSE_UNLOCK: {
            target: 'reviewMessage',
          },
        },
      },
      signingMessage: {
        invoke: {
          src: 'signMessage',
          data: {
            input: (ctx: MachineContext, ev: { data: WalletUnlocked }) => ({
              message: ctx.message,
              wallet: ev.data,
            }),
          },
          onDone: [
            FetchMachine.errorState('failed'),
            {
              actions: ['assignSignedMessage'],
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
    delays: { TIMEOUT: 10000 },
    actions: {
      assignSignedMessage: assign({
        signedMessage: (_, ev) => ev.data,
      }),
      assignSignData: assign((ctx, ev) => ({
        ...ctx,
        message: ev.input.message,
        address: ev.input.address,
        origin: ev.input.origin,
      })),
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
    },
    services: {
      unlock: unlockMachine,
      signMessage: FetchMachine.create<
        { message: string; wallet: WalletUnlocked },
        string
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.wallet || !input?.message) {
            throw new Error('Invalid network input');
          }

          const signedMessage = input?.wallet.signMessage(input.message);
          return signedMessage;
        },
      }),
      fetchAccount: FetchMachine.create<{ address: string }, Account>({
        showError: true,
        async fetch({ input }) {
          if (!input?.address) {
            throw new Error('Invalid fetchAccount input');
          }
          return AccountService.fetchAccount({
            address: input.address,
          });
        },
      }),
    },
  }
);

export type SignMachine = typeof signMachine;
export type SignMachineService = InterpreterFrom<typeof signMachine>;
export type SignMachineState = StateFrom<typeof signMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
