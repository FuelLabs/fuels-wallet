import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { UnlockService } from '~/systems/Account/services';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';

type MachineContext = {
  message?: string;
  origin?: string;
  error?: string;
  unlockError?: string;
  signedMessage?: string;
};

type MachineServices = {
  signMessage: {
    data: string;
  };
};

type MachineEvents =
  | { type: 'START_SIGN'; input: { origin: string; message: string } }
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
            actions: ['assignMessage', 'assignOrigin'],
            target: 'reviewMessage',
          },
        },
      },
      reviewMessage: {
        on: {
          SIGN_MESSAGE: {
            target: 'signingMessage',
          },
          REJECT: {
            actions: [assignErrorMessage('Rejected request!')],
            target: 'failed',
          },
        },
      },
      signingMessage: {
        invoke: {
          src: 'signMessage',
          data: {
            input: (ctx: MachineContext) => ctx,
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
      signMessage: FetchMachine.create<{ message: string }, string>({
        showError: true,
        async fetch({ input }) {
          const wallet = await UnlockService.getWalletUnlocked();
          if (!wallet) {
            throw new Error('Wallet is required');
          }
          if (!input?.message) {
            throw new Error('Invalid network input');
          }
          return wallet.signMessage(input.message);
        },
      }),
    },
  }
);

export type SignMachine = typeof signMachine;
export type SignMachineService = InterpreterFrom<typeof signMachine>;
export type SignMachineState = StateFrom<typeof signMachine>;
