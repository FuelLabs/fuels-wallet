/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Account } from '@fuel-wallet/types';
import type {
  BN,
  TransactionRequest,
  TransactionResponse,
  TransactionResultReceipt,
} from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { AccountService } from '~/systems/Account';
import { assignErrorMessage, FetchMachine } from '~/systems/Core';
import type { NetworkInputs } from '~/systems/Network';
import { NetworkService } from '~/systems/Network';
import type { GroupedErrors, VMApiError } from '~/systems/Transaction';
import { getGroupedErrors } from '~/systems/Transaction';
import type { TxInputs } from '~/systems/Transaction/services';
import { TxService } from '~/systems/Transaction/services';

export enum TxRequestStatus {
  inactive = 'inactive',
  idle = 'idle',
  loading = 'loading',
  waitingApproval = 'waitingApproval',
  waitingUnlock = 'waitingUnlock',
  unlocking = 'unlocking',
  sending = 'sending',
  success = 'success',
  failed = 'failed',
}

type MachineContext = {
  input: {
    origin?: string;
    address?: string;
    isOriginRequired?: boolean;
    providerUrl?: string;
    transactionRequest?: TransactionRequest;
    account?: Account;
  };
  response?: {
    receipts?: TransactionResultReceipt[];
    approvedTx?: TransactionResponse;
  };
  errors?: {
    unlockError?: string;
    txApproveError?: VMApiError;
    txDryRunGroupedErrors?: GroupedErrors;
  };
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
  fetchAccount: {
    data: Account;
  };
};

type MachineEvents =
  | { type: 'START'; input?: TxInputs['request'] }
  | { type: 'RESET'; input?: null }
  | { type: 'APPROVE'; input?: null }
  | { type: 'REJECT'; input?: null }
  | { type: 'TRY_AGAIN'; input?: null }
  | { type: 'CLOSE'; input?: null };

export const transactionRequestMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./transactionRequestMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    id: '(machine)',
    initial: 'idle',
    context: {
      input: {},
    },
    states: {
      idle: {
        on: {
          START: {
            actions: ['assignTxRequestData'],
            target: 'fetchingAccount',
          },
        },
      },
      fetchingAccount: {
        invoke: {
          src: 'fetchAccount',
          data: {
            input: (ctx: MachineContext) => ({
              address: ctx.input.address,
              providerUrl: ctx.input.providerUrl,
            }),
          },
          onDone: [
            {
              cond: FetchMachine.hasError,
              target: 'failed',
            },
            {
              actions: ['assignAccount'],
              target: 'settingGasPrice',
            },
          ],
        },
      },
      settingGasPrice: {
        tags: ['loading'],
        invoke: {
          src: 'fetchGasPrice',
          data: ({ input }: MachineContext) => ({ input }),
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
          data: ({ input }: MachineContext) => ({ input }),
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
          APPROVE: {
            target: 'sendingTx',
          },
          REJECT: {
            actions: [assignErrorMessage('User rejected the transaction!')],
            target: 'failed',
          },
          RESET: {
            actions: ['reset'],
            target: 'idle',
          },
        },
      },
      sendingTx: {
        tags: ['loading'],
        invoke: {
          src: 'send',
          data: {
            input: (ctx: MachineContext) => ctx.input,
          },
          onDone: [
            {
              target: 'failed',
              actions: ['assignTxApproveError'],
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignApprovedTx'],
              target: 'txSuccess',
            },
          ],
        },
      },
      txSuccess: {
        on: {
          CLOSE: {
            target: 'done',
          },
        },
      },
      txFailed: {
        on: {
          TRY_AGAIN: {
            target: 'waitingApproval',
          },
          CLOSE: {
            target: 'failed',
          },
        },
      },
      done: {
        type: 'final',
      },
      failed: {
        type: 'final',
      },
    },
  },
  {
    delays: { TIMEOUT: 1300 },
    actions: {
      reset: assign(() => ({})),
      assignAccount: assign({
        input: (ctx, ev) => ({
          ...ctx.input,
          account: ev.data,
        }),
      }),
      assignTxRequestData: assign({
        input: (ctx, ev) => {
          const { transactionRequest, origin, address, providerUrl } =
            ev.input || {};

          if (!providerUrl) {
            throw new Error('providerUrl is required');
          }
          if (!address) {
            throw new Error('address is required');
          }
          if (!transactionRequest) {
            throw new Error('transaction is required');
          }
          if (ctx.input.isOriginRequired && !origin) {
            throw new Error('origin is required');
          }

          return {
            transactionRequest,
            origin,
            address,
            providerUrl,
          };
        },
      }),
      assignGasPrice: assign((ctx, ev) => {
        if (!ctx.input.transactionRequest) {
          throw new Error('Transaction is required');
        }
        ctx.input.transactionRequest.gasPrice = ev.data;
        return ctx;
      }),
      assignApprovedTx: assign({
        response: (ctx, ev) => ({ ...ctx.response, approvedTx: ev.data }),
      }),
      assignReceipts: assign({
        response: (ctx, ev) => ({ ...ctx.response, receipts: ev.data }),
      }),
      assignTxDryRunError: assign((ctx, ev) => {
        const txDryRunGroupedErrors = getGroupedErrors(
          (ev.data as any)?.error?.response?.errors
        );
        return {
          ...ctx,
          errors: {
            ...ctx.errors,
            txDryRunGroupedErrors,
          },
          error: JSON.stringify(txDryRunGroupedErrors),
        };
      }),
      assignTxApproveError: assign({
        errors: (ctx, ev) => ({
          ...ctx.errors,
          txApproveError: (ev.data as any)?.error,
        }),
      }),
    },
    services: {
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
        maxAttempts: 1,
        async fetch(params) {
          const { input } = params;
          if (!input?.address || !input?.transactionRequest) {
            throw new Error('Invalid approveTx input');
          }
          return TxService.send(input);
        },
      }),
      fetchAccount: FetchMachine.create<
        { address: string; providerUrl: string },
        Account
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.address || !input?.providerUrl) {
            throw new Error('Invalid fetchAccount input');
          }
          const account = await AccountService.fetchAccount({
            address: input.address,
          });
          const accountWithBalances = await AccountService.fetchBalance({
            account,
            providerUrl: input.providerUrl,
          });

          return accountWithBalances;
        },
      }),
    },
  }
);

export type TransactionRequestMachine = typeof transactionRequestMachine;
export type TransactionRequestService =
  InterpreterFrom<TransactionRequestMachine>;
export type TransactionRequestState = StateFrom<TransactionRequestMachine>;
