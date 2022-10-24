import type { Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { send, assign, createMachine } from 'xstate';

import type { UnlockMachineEvents, UnlockMachine } from './unlockMachine';
import { unlockMachine } from './unlockMachine';

import type { AccountInputs } from '~/systems/Account';
import { FetchMachine } from '~/systems/Core';
import type { ChildrenMachine } from '~/systems/Core';

type MachineContext = {
  message?: string;
  signedMessage?: string;
};

type MachineServices = {
  signMessage: {
    data: string;
  };
};

type MachineEvents =
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] }
  | { type: 'START_SIGN'; input: { message: string } }
  | { type: 'CLOSE_UNLOCK'; input?: null };

export const signMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./signMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          START_SIGN: {
            actions: ['assignMessage'],
            target: 'unlocking',
          },
        },
      },
      unlocking: {
        invoke: {
          id: 'unlock',
          src: unlockMachine,
          data: (_: MachineContext, ev: MachineEvents) => ev.input,
          onDone: {
            target: 'signingMessage',
          },
        },
        on: {
          UNLOCK_WALLET: {
            // send to the child machine
            actions: [
              send<MachineContext, UnlockMachineEvents>(
                (_, ev) => ({
                  type: 'UNLOCK_WALLET',
                  input: ev.input,
                }),
                { to: 'unlock' }
              ),
            ],
          },
          CLOSE_UNLOCK: {
            target: 'idle',
          },
        },
      },
      signingMessage: {
        invoke: {
          src: 'signMessage',
          data: {
            input: (_: MachineContext, ev: { data: Wallet }) => {
              return { message: _.message, wallet: ev.data };
            },
          },
          onDone: [
            {
              target: 'done',
              cond: FetchMachine.hasError,
            },
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
    actions: {
      assignSignedMessage: assign({
        signedMessage: (_, ev) => ev.data,
      }),
      assignMessage: assign({
        message: (_, ev) => ev.input.message,
      }),
    },
    services: {
      signMessage: FetchMachine.create<
        { message: string; wallet: Wallet },
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
    },
  }
);

export type SignMachine = typeof signMachine;
export type SignMachineService = InterpreterFrom<typeof signMachine>;
export type SignMachineState = StateFrom<typeof signMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
