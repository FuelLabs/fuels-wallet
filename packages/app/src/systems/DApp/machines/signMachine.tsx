import type { WalletUnlocked } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { send, assign, createMachine } from 'xstate';

import type { UnlockMachineEvents, UnlockMachine } from './unlockMachine';
import { unlockMachine } from './unlockMachine';

import type { AccountInputs } from '~/systems/Account';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { ChildrenMachine } from '~/systems/Core';

type MachineContext = {
  message?: string;
  origin?: string;
  error?: string;
  signedMessage?: string;
};

type MachineServices = {
  signMessage: {
    data: string;
  };
};

type MachineEvents =
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] }
  | { type: 'START_SIGN'; input: { origin: string; message: string } }
  | { type: 'CLOSE_UNLOCK' }
  | { type: 'SIGN_MESSAGE' }
  | { type: 'REJECT' };

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
            actions: ['assignMessage', 'assignOrigin'],
            target: 'reviewMessage',
          },
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
          src: unlockMachine as UnlockMachine,
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
            target: 'reviewMessage',
          },
        },
      },
      signingMessage: {
        invoke: {
          src: 'signMessage',
          data: {
            input: (_: MachineContext, ev: { data: WalletUnlocked }) => {
              return { message: _.message, wallet: ev.data };
            },
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
    actions: {
      assignSignedMessage: assign({
        signedMessage: (_, ev) => ev.data,
      }),
      assignMessage: assign({
        message: (_, ev) => ev.input.message,
      }),
      assignOrigin: assign({
        origin: (_, ev) => ev.input.origin,
      }),
    },
    services: {
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
    },
  }
);

export type SignMachine = typeof signMachine;
export type SignMachineService = InterpreterFrom<typeof signMachine>;
export type SignMachineState = StateFrom<typeof signMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
