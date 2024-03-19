import type { TransactionResponse, TransactionResult } from 'fuels';
import { isB256 } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { TxService } from '../services';

export const TRANSACTION_ERRORS = {
  INVALID_ID: 'Invalid transaction ID',
  NOT_FOUND: 'Transaction not found',
  RECEIPTS_NOT_FOUND: 'Receipts not found for this transaction',
};

type MachineContext = {
  error?: string;
  txId?: string;
  txResult?: TransactionResult;
  txResponse?: TransactionResponse;
};

type MachineServices = {
  getTransaction: {
    data: {
      txResult: TransactionResult;
      txResponse: TransactionResponse;
    };
  };
  getTransactionResult: {
    data: {
      txResult: TransactionResult;
    };
  };
};

type MachineEvents = {
  type: 'GET_TRANSACTION';
  input: { providerUrl?: string; txId?: string };
};

export const transactionMachine = createMachine(
  {
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
              actions: ['assignTxResult', 'assignTxResponse'],
              target: 'fetchingResult',
              cond: 'isStatusPending',
            },
            {
              actions: ['assignTxResult', 'assignTxResponse'],
              target: 'done',
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
              txResponse: ctx.txResponse,
            },
          }),
          onDone: [
            {
              actions: ['assignGetTransactionResultError'],
              target: 'done',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignTxResult'],
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
      assignTxResponse: assign({
        txResponse: (_, ev) => ev.data.txResponse,
      }),
    },
    guards: {
      isInvalidTxId: (_, ev) => !isB256(ev.input?.txId || ''),
      isStatusPending: (ctx, ev) =>
        ctx.txResult?.isStatusPending || ev.data.txResult.isStatusPending,
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

          const { txResult, txResponse } = await TxService.fetch({
            providerUrl,
            txId: input.txId,
          });

          return {
            txResult,
            txResponse,
          };
        },
      }),
      getTransactionResult: FetchMachine.create<
        { txResponse: TransactionResponse },
        MachineServices['getTransactionResult']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input?.txResponse) {
            throw new Error('Invalid tx response');
          }

          const txResult = await input.txResponse.waitForResult();

          // TODO: remove this when we get SDK with new TransactionResponse flow
          const selectedNetwork = await NetworkService.getSelectedNetwork();
          const defaultProvider = import.meta.env.VITE_FUEL_PROVIDER_URL;

          const providerUrl = selectedNetwork?.url || defaultProvider;
          const { txResult: txResultWithCalls } = await TxService.fetch({
            providerUrl,
            txId: txResult.id || '',
          });

          return { txResult: txResultWithCalls };
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
