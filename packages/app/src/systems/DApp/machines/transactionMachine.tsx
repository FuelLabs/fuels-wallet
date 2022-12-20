/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BN, TransactionRequest, TransactionResponse } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { send } from 'xstate/lib/actions';

import { unlockMachineErrorAction, unlockMachine } from '~/systems/Account';
import type {
  UnlockMachine,
  UnlockMachineEvents,
  AccountInputs,
  UnlockEventReturn,
} from '~/systems/Account';
import type { ChildrenMachine } from '~/systems/Core';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { GroupedErrors, VMApiError } from '~/systems/Transaction';
import { getGroupedErrors } from '~/systems/Transaction';
import type { TxInputs } from '~/systems/Transaction/services';
import { TxService } from '~/systems/Transaction/services';

type MachineContext = {
  origin?: string;
  isOriginRequired?: boolean;
  unlockError?: string;
  error?: string;
  providerUrl?: string;
  fee?: BN;
  tx?: TransactionRequest;
  approvedTx?: TransactionResponse;
  txApproveError?: VMApiError;
  txDryRunGroupedErrors?: GroupedErrors;
};

type MachineServices = {
  send: {
    data: TransactionResponse;
  };
  calculateFee: {
    data: BN;
  };
  fetchGasPrice: {
    data: BN;
  };
};

type MachineEvents =
  | {
      type: 'START_REQUEST';
      input?: TxInputs['request'];
    }
  | {
      type: 'APPROVE';
      input?: void;
    }
  | {
      type: 'REJECT';
      input?: void;
    }
  | {
      type: 'UNLOCK_WALLET';
      input: AccountInputs['unlock'];
    }
  | {
      type: 'CLOSE_UNLOCK';
      input?: void;
    };

export const transactionMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./transactionMachine.typegen').Typegen0,
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
          START_REQUEST: {
            actions: ['assignTxRequestData'],
            target: 'settingGasPrice',
          },
        },
      },
      settingGasPrice: {
        invoke: {
          src: 'fetchGasPrice',
          data: (ctx: MachineContext) => ({
            input: { tx: ctx.tx, providerUrl: ctx.providerUrl },
          }),
          onDone: [
            {
              target: 'calculatingGas',
              actions: ['assignGasPrice'],
            },
          ],
        },
      },
      calculatingGas: {
        invoke: {
          src: 'calculateFee',
          data: (ctx: MachineContext) => ({
            input: { tx: ctx.tx, providerUrl: ctx.providerUrl },
          }),
          onDone: [
            {
              actions: ['assignTxDryRunError'],
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              target: 'waitingApproval',
              actions: ['assignFee'],
            },
          ],
        },
      },
      waitingApproval: {
        on: {
          APPROVE: 'unlocking',
        },
      },
      unlocking: {
        invoke: {
          id: 'unlock',
          src: unlockMachine,
          data: (_: MachineContext, ev: MachineEvents) => ev.input,
          onDone: [
            unlockMachineErrorAction('unlocking', 'unlockError'),
            { target: 'sendingTx' },
          ],
        },
        on: {
          UNLOCK_WALLET: {
            // send to the child machine
            actions: [
              send<MachineContext, UnlockMachineEvents>(
                (_, ev) => ({ type: 'UNLOCK_WALLET', input: ev.input }),
                { to: 'unlock' }
              ),
            ],
          },
          CLOSE_UNLOCK: {
            target: 'waitingApproval',
          },
        },
      },
      sendingTx: {
        invoke: {
          src: 'send',
          data: {
            input: (_: MachineContext, ev: UnlockEventReturn) => {
              return { tx: _.tx, wallet: ev.data, providerUrl: _.providerUrl };
            },
          },
          onDone: [
            {
              target: 'failed',
              actions: ['assignTransactionRequestError'],
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
    on: {
      REJECT: {
        actions: [assignErrorMessage('User rejected the transaction!')],
        target: 'failed',
      },
    },
  },
  {
    actions: {
      assignTxRequestData: assign((ctx, ev) => {
        const { tx, origin, providerUrl } = ev.input || {};

        if (!providerUrl) {
          throw new Error('providerUrl is required');
        }
        if (!tx) {
          throw new Error('transaction is required');
        }
        if (ctx.isOriginRequired && !origin) {
          throw new Error('origin is required');
        }

        return {
          tx,
          origin,
          providerUrl,
        };
      }),
      assignGasPrice: assign((ctx, ev) => {
        if (!ctx.tx) {
          throw new Error('Transaction is required');
        }
        ctx.tx.gasPrice = ev.data;
        return ctx;
      }),
      assignApprovedTx: assign({
        approvedTx: (_, ev) => ev.data,
      }),
      assignTxDryRunError: assign({
        txDryRunGroupedErrors: (_, ev: any) => {
          const error = ev.data.error;
          return getGroupedErrors(error?.response?.errors);
        },
      }),
      assignTransactionRequestError: assign({
        txApproveError: (_, ev: any) => ev.data.error,
      }),
      assignFee: assign({
        fee: (_, ev) => ev.data,
      }),
    },
    services: {
      fetchGasPrice: FetchMachine.create<TxInputs['fetchGasPrice'], BN>({
        showError: false,
        async fetch({ input }) {
          if (!input?.providerUrl) {
            throw new Error('providerUrl is required');
          }
          return TxService.fetchGasPrice(input);
        },
      }),
      calculateFee: FetchMachine.create<TxInputs['calculateFee'], BN>({
        showError: false,
        async fetch({ input }) {
          if (!input?.tx) {
            throw new Error('Invalid calculateFee input');
          }
          return TxService.calculateFee(input);
        },
      }),
      send: FetchMachine.create<TxInputs['send'], TransactionResponse>({
        showError: true,
        async fetch(params) {
          const { input } = params;
          if (!input?.wallet || !input?.tx) {
            throw new Error('Invalid approveTx input');
          }
          return TxService.send(input);
        },
      }),
    },
  }
);

export type TransactionMachine = typeof transactionMachine;
export type TransactionMachineService = InterpreterFrom<TransactionMachine>;
export type TransactionMachineState = StateFrom<TransactionMachine> &
  ChildrenMachine<{
    unlock: UnlockMachine;
  }>;
