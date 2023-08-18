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

import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

export const TRANSACTION_ERRORS = {
  INVALID_ID: 'Invalid transaction ID',
  NOT_FOUND: 'Transaction not found',
  RECEIPTS_NOT_FOUND: 'Receipts not found for this transaction',
};

type MachineContext = {
  error?: string;
  transactionResponse?: TransactionResponse;
  transaction?: Transaction;
  transactionResult?: TransactionResult<any>;
  txId?: string;
  txResult?: TransactionResult;
};

type MachineServices = {
  getTransaction: {
    data: {
      txResult: TransactionResult;
    };
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
        tags: ['isLoading'],
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
              actions: ['assignTxResult'],
              target: 'fetchingResult',
            },
          ],
        },
      },
      fetchingResult: {
        tags: ['isLoading'],
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
              target: 'done',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignGetTransactionResult'],
              target: 'done',
            },
          ],
        },
      },
      done: {},
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
      assignTxResult: assign({
        txResult: (_, ev) => ev.data.txResult,
      }),
      assignGetTransactionResult: assign((_, event) => {
        const transactionResult = event.data as TransactionResult<any>;

        return {
          transactionResult,
          transaction: transactionResult.transaction,
        };
      }),
    },
    guards: {
      isInvalidTxId: (ctx, ev) => !isB256(ev.input?.txId || ''),
    },
    services: {
      getTransaction: FetchMachine.create<
        { providerUrl?: string; txId: string },
        MachineServices['getTransaction']['data']
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

          const txResult = await TxService.fetch({
            providerUrl,
            txId: input.txId,
          });

          if (!txResult) {
            throw Error('Transaction not found');
          }

          return {
            txResult,
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
