import type { Wallet } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { AccountInputs } from '~/systems/Account';
import { FetchMachine } from '~/systems/Core';
import type { Transaction, TxResponse } from '~/systems/Transaction';

type MachineContext = {
  id: string;
  tx?: Transaction;
};

type MachineServices = {
  approve: {
    data: TxResponse;
  };
};

type MachineEvents =
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] }
  | { type: 'START_SIGN'; input: { message: string } }
  | { type: 'CLOSE_UNLOCK'; input?: null };

export const txApprove = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./txApproveMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'fetching',
    states: {
      fetching: {
        tags: 'loading',
        invoke: {
          src: 'fetching',
          data: {
            input: (_: MachineContext) => _.id,
          },
          onDone: [
            {
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              target: 'simulating',
              cond: 'isTxRequest',
              actions: ['assignTx'],
            },
            {
              target: 'idle',
              actions: ['assignTx'],
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

export type SignMachine = typeof txApprove;
export type SignMachineService = InterpreterFrom<typeof txApprove>;
export type SignMachineState = StateFrom<typeof txApprove>;
