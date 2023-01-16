import type { Transaction } from 'fuels';
import { isB256, isBech32 } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import { TxService } from '../services';

import type { AddressTransactionsQuery } from '~/generated/graphql';
import { FetchMachine } from '~/systems/Core';

export const TRANSACTION_HISTORY_ERRORS = {
  INVALID_ADDRESS: 'Invalid address',
  NOT_FOUND: 'Address Transaction history not found',
};

type MachineContext = {
  walletAddress: string;
  txs: Transaction[];
  error?: string;
  addressTransactionsQuery?: AddressTransactionsQuery;
};

type MachineServices = {
  getTransactionHistory: {
    data: AddressTransactionsQuery;
  };
};

type MachineEvents = {
  type: 'GET_TRANSACTION_HISTORY';
  input: { address: string };
};

export const transactionHistoryMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./transactionHistoryMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as MachineEvents,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_TRANSACTION_HISTORY: [
            {
              cond: 'isInvalidAddress',
              actions: 'assignInvalidAddressError',
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
          src: 'getTransactionHistory',
          data: (_, event: MachineEvents) => ({
            input: event.input,
          }),
          onDone: [
            {
              actions: ['assignGetTransactionHistoryError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignGetTransactionHistoryResponse'],
              target: 'idle',
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      isInvalidAddress: (_, ev) => {
        return !isB256(ev.input?.address) && !isBech32(ev.input?.address);
      },
    },
    actions: {
      assignInvalidAddressError: assign({
        error: (_) => TRANSACTION_HISTORY_ERRORS.INVALID_ADDRESS,
      }),
      assignGetTransactionHistoryError: assign({
        error: (_) => TRANSACTION_HISTORY_ERRORS.NOT_FOUND,
      }),
      assignGetTransactionHistoryResponse: assign((_, event) => {
        const { data } = event;
        return {
          addressTransactionsQuery: data,
        };
      }),
      clearError: assign({
        error: (_) => undefined,
      }),
    },
    services: {
      getTransactionHistory: FetchMachine.create<
        { address: string },
        AddressTransactionsQuery
      >({
        showError: true,
        async fetch({ input }) {
          const address = input?.address;
          const data = await TxService.getTransactionHistory({
            address: address?.toString() || '',
          });
          return data;
        },
      }),
    },
  }
);

export type TransactionHistoryMachine = typeof transactionHistoryMachine;
export type TransactionHistoryMachineService = InterpreterFrom<
  typeof transactionHistoryMachine
>;
export type TransactionHistoryMachineState = StateFrom<
  typeof transactionHistoryMachine
>;
