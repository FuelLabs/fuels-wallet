/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Transaction,
  TransactionResponse,
  TransactionResult,
} from 'fuels';
import { isB256 } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { TxService } from '../services';
import type { GqlTransactionStatus } from '../utils';

import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

export const TRANSACTION_ERRORS = {
  INVALID_ID: 'Invalid transaction ID',
  NOT_FOUND: 'Transaction not found',
  RECEIPTS_NOT_FOUND: 'Receipts not found for this transaction',
};

type GetTransactionResponse = {
  transactionResponse: TransactionResponse;
  transaction: Transaction;
  gqlTransactionStatus?: GqlTransactionStatus;
  txId?: string;
};

type MachineContext = {
  error?: string;
  transactionResponse?: TransactionResponse;
  gqlTransactionStatus?: GqlTransactionStatus;
  transaction?: Transaction;
  transactionResult?: TransactionResult<any>;
  txId?: string;
};

type MachineServices = {
  getTransaction: {
    data: GetTransactionResponse;
  };
  getTransactionResult: {
    data: TransactionResult<any>;
  };
};

type MachineEvents = {
  type: 'GET_TRANSACTION';
  input: { providerUrl?: string; txId?: string };
};

export const transactionMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./transactionMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    context: {},
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_TRANSACTION: [
            {
              cond: 'isInvalidTxId',
              actions: 'assignInvalidTxIdError',
            },
            {
              target: 'fetching',
            },
          ],
        },
      },
      fetching: {
        entry: 'clearError',
        invoke: {
          src: 'getTransaction',
          data: (_, event: MachineEvents) => ({
            input: event.input,
          }),
          onDone: [
            {
              actions: ['assignGetTransactionError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignGetTransactionResponse'],
              target: 'fetchingResult',
            },
          ],
        },
      },
      fetchingResult: {
        invoke: {
          src: 'getTransactionResult',
          data: (ctx) => ({
            input: {
              transactionResponse: ctx.transactionResponse,
            },
          }),
          onDone: [
            {
              actions: ['assignGetTransactionResultError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignGetTransactionResult'],
              target: 'idle',
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      assignInvalidTxIdError: assign({
        error: (_) => TRANSACTION_ERRORS.INVALID_ID,
      }),
      assignGetTransactionError: assign({
        error: (_) => TRANSACTION_ERRORS.NOT_FOUND,
      }),
      assignGetTransactionResultError: assign({
        error: (_) => TRANSACTION_ERRORS.RECEIPTS_NOT_FOUND,
      }),
      clearError: assign({
        error: (_) => undefined,
      }),
      assignGetTransactionResponse: assign((_, event) => {
        const data = event.data as GetTransactionResponse;

        return {
          transactionResponse: data.transactionResponse,
          tx: data.transaction,
          gqlTransactionStatus: data.gqlTransactionStatus,
          txId: data.txId,
        };
      }),
      assignGetTransactionResult: assign((_, event) => {
        const transactionResult = event.data as TransactionResult<any>;

        return {
          transactionResult,
          transaction: transactionResult.transaction,
          gqlTransactionStatus: (transactionResult.status.type === 'success'
            ? 'SuccessStatus'
            : 'FailureStatus') as GqlTransactionStatus,
        };
      }),
    },
    guards: {
      isInvalidTxId: (ctx, ev) => !isB256(ev.input?.txId || ''),
    },
    services: {
      getTransaction: FetchMachine.create<
        { providerUrl?: string; txId: string },
        GetTransactionResponse
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.txId || !isB256(input?.txId)) {
            throw new Error('Invalid tx ID');
          }

          const selectedNetwork = await NetworkService.getSelectedNetwork();
          const defaultProvider = import.meta.env.VITE_FUEL_PROVIDER_URL;

          const providerUrl =
            input?.providerUrl || selectedNetwork?.url || defaultProvider;

          const transactionResponse = await TxService.fetch({
            providerUrl,
            txId: input.txId,
          });
          const gqlTransaction = await transactionResponse.fetch();
          if (!gqlTransaction) {
            throw Error('Transaction not found');
          }
          const transaction =
            transactionResponse.decodeTransaction(gqlTransaction);

          return {
            transaction,
            transactionResponse,
            gqlTransactionStatus: gqlTransaction?.status?.type,
            txId: gqlTransaction?.id,
          };
        },
      }),
      getTransactionResult: FetchMachine.create<
        { transactionResponse: TransactionResponse },
        TransactionResult<any>
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.transactionResponse) {
            throw new Error('Invalid tx response');
          }

          const transactionResult =
            await input?.transactionResponse?.waitForResult();

          return transactionResult;
        },
      }),
    },
  }
);

export type TransactionMachine = typeof transactionMachine;
export type TransactionMachineService = InterpreterFrom<
  typeof transactionMachine
>;
export type TransactionMachineState = StateFrom<typeof transactionMachine>;
