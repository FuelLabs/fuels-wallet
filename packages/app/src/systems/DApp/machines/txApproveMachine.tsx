import type {
  TransactionRequest,
  TransactionResponse,
  TransactionResultReceipt,
  Wallet,
} from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { send } from 'xstate/lib/actions';

import type { UnlockMachine, UnlockMachineEvents } from './unlockMachine';
import { unlockMachine } from './unlockMachine';

import type { AccountInputs } from '~/systems/Account';
import type { ChildrenMachine } from '~/systems/Core';
import { FetchMachine, provider } from '~/systems/Core';
import type { VMApiError } from '~/systems/Transaction';

type MachineContext = {
  tx?: TransactionRequest;
  receipts?: TransactionResultReceipt[];
  approvedTx?: TransactionResponse;
  txDryRunError?: VMApiError;
  txApproveError?: VMApiError;
};

type MachineServices = {
  approveTx: {
    data: TransactionResponse;
  };
  calculateGas: {
    data: TransactionResultReceipt[];
  };
};

type MachineEvents =
  | { type: 'UNLOCK_WALLET'; input: AccountInputs['unlock'] }
  | { type: 'START_APPROVE'; input?: null }
  | { type: 'CALCULATE_GAS'; input: { tx: TransactionRequest } }
  | { type: 'CLOSE_UNLOCK'; input?: null };

export const txApproveMachine = createMachine(
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
    initial: 'waitingTxRequest',
    states: {
      waitingTxRequest: {
        on: {
          CALCULATE_GAS: {
            target: 'calculatingGas',
            actions: ['assignTx'],
          },
        },
      },
      calculatingGas: {
        invoke: {
          src: 'calculateGas',
          data: (_: MachineContext) => ({ input: { tx: _.tx } }),
          onDone: [
            {
              actions: ['assignTxDryRunError'],
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              target: 'idle',
              actions: ['assignReceipts'],
            },
          ],
        },
      },
      idle: {
        on: {
          START_APPROVE: {
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
            target: 'approving',
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
      approving: {
        invoke: {
          src: 'approveTx',
          data: {
            input: (_: MachineContext, ev: { data: Wallet }) => {
              return { tx: _.tx, wallet: ev.data };
            },
          },
          onDone: [
            {
              target: 'failed',
              actions: ['assignTxApproveError'],
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignApprovedTx'],
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
      assignTx: assign({
        tx: (_, ev) => ev.input?.tx,
      }),
      assignApprovedTx: assign({
        approvedTx: (_, ev) => ev.data,
      }),
      assignTxDryRunError: assign({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        txDryRunError: (_, ev: any) => ev.data.error,
      }),
      assignTxApproveError: assign({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        txApproveError: (_, ev: any) => ev.data.error,
      }),
      assignReceipts: assign({
        receipts: (_, ev) => ev.data,
      }),
    },
    services: {
      approveTx: FetchMachine.create<
        { tx: TransactionRequest; wallet: Wallet },
        TransactionResponse
      >({
        showError: true,
        async fetch(params) {
          const { input } = params;
          if (!input?.wallet || !input?.tx) {
            throw new Error('Invalid approveTx input');
          }

          input.wallet.provider = provider;
          const transactionResponse = await input?.wallet.sendTransaction(
            input.tx
          );

          return transactionResponse;
        },
      }),
      calculateGas: FetchMachine.create<
        { tx: TransactionRequest },
        TransactionResultReceipt[]
      >({
        showError: false,
        async fetch({ input }) {
          if (!input?.tx) {
            throw new Error('Invalid calculateGas input');
          }

          const { receipts } = await provider.call(input.tx);
          return receipts;
        },
      }),
    },
  }
);

export type TxApproveMachine = typeof txApproveMachine;
export type TxApproveMachineService = InterpreterFrom<typeof txApproveMachine>;
export type TxApproveMachineState = StateFrom<typeof txApproveMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
