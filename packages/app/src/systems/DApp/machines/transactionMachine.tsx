/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BN,
  TransactionRequest,
  TransactionResponse,
  TransactionResultReceipt,
  WalletUnlocked,
} from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { send } from 'xstate/lib/actions';

import { unlockMachineErrorAction, unlockMachine } from '~/systems/Account';
import type {
  UnlockMachine,
  UnlockMachineEvents,
  AccountInputs,
} from '~/systems/Account';
import type { ChildrenMachine } from '~/systems/Core';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { NetworkInputs } from '~/systems/Network';
import { NetworkService } from '~/systems/Network';
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
  receipts?: TransactionResultReceipt[];
  transactionRequest?: TransactionRequest;
  approvedTx?: TransactionResponse;
  txApproveError?: VMApiError;
  txDryRunGroupedErrors?: GroupedErrors;
};

type MachineServices = {
  send: {
    data: TransactionResponse;
  };
  simulateTransaction: {
    data: TransactionResultReceipt[];
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
        tags: ['loading'],
        invoke: {
          src: 'fetchGasPrice',
          data: ({ transactionRequest, providerUrl }: MachineContext) => ({
            input: { transactionRequest, providerUrl },
          }),
          onDone: [
            {
              target: 'simulatingTransaction',
              actions: ['assignGasPrice'],
            },
          ],
        },
      },
      simulatingTransaction: {
        tags: ['loading'],
        invoke: {
          src: 'simulateTransaction',
          data: (ctx: MachineContext) => ({
            input: {
              transactionRequest: ctx.transactionRequest,
              providerUrl: ctx.providerUrl,
            },
          }),
          onDone: [
            {
              actions: ['assignTxDryRunError'],
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              target: 'waitingApproval',
              actions: ['assignReceipts'],
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
          src: 'unlock',
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
            input: (ctx: MachineContext, ev: { data: WalletUnlocked }) => {
              return {
                transactionRequest: ctx.transactionRequest,
                wallet: ev.data,
                providerUrl: ctx.providerUrl,
              };
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
        const { transactionRequest, origin, providerUrl } = ev.input || {};

        if (!providerUrl) {
          throw new Error('providerUrl is required');
        }
        if (!transactionRequest) {
          throw new Error('transaction is required');
        }
        if (ctx.isOriginRequired && !origin) {
          throw new Error('origin is required');
        }

        return {
          transactionRequest,
          origin,
          providerUrl,
        };
      }),
      assignGasPrice: assign((ctx, ev) => {
        if (!ctx.transactionRequest) {
          throw new Error('Transaction is required');
        }
        ctx.transactionRequest.gasPrice = ev.data;
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
      assignReceipts: assign({
        receipts: (_, ev) => ev.data,
      }),
    },
    services: {
      unlock: unlockMachine,
      fetchGasPrice: FetchMachine.create<NetworkInputs['getNodeInfo'], BN>({
        showError: false,
        async fetch({ input }) {
          if (!input?.providerUrl) {
            throw new Error('providerUrl is required');
          }

          const { minGasPrice } = await NetworkService.getNodeInfo(input);
          return minGasPrice;
        },
      }),
      simulateTransaction: FetchMachine.create<
        TxInputs['simulateTransaction'],
        MachineServices['simulateTransaction']['data']
      >({
        showError: false,
        async fetch({ input }) {
          if (!input?.transactionRequest) {
            throw new Error('Invalid simulateTransaction input');
          }

          const receipts = await TxService.simulateTransaction(input);
          return receipts;
        },
      }),
      send: FetchMachine.create<
        TxInputs['send'],
        MachineServices['send']['data']
      >({
        showError: true,
        async fetch(params) {
          const { input } = params;
          if (!input?.wallet || !input?.transactionRequest) {
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
