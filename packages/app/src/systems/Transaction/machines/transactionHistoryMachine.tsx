import type { TransactionResult } from 'fuels';
import { isB256, isBech32 } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { type TxInputs, TxService } from '../services';
import type { TransactionCursor } from '../types';

const TRANSACTION_HISTORY_ERRORS = {
  INVALID_ADDRESS: 'Invalid address',
  NOT_FOUND: 'Address Transaction history not found',
};

type MachineContext = {
  walletAddress: string;
  error?: string;
  transactionHistory?: TransactionResult[];
  currentCursor?: TransactionCursor;
  cursors: TransactionCursor[];
};

type MachineServices = {
  getTransactionHistory: {
    data: {
      transactionHistory: TransactionResult[];
    };
  };
  getAllCursors: {
    data: {
      cursors: TransactionCursor[];
    };
  };
  getCachedCursors: {
    data: {
      cursors: TransactionCursor[];
    };
  };
};

type MachineEvents =
  | {
      type: 'GET_TRANSACTION_HISTORY';
      input: TxInputs['getTransactionHistory'];
    }
  | {
      type: 'FETCH_NEXT_PAGE';
      input?: never;
    };

export const transactionHistoryMachine = createMachine(
  {
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
              actions: 'assignWalletAddress',
              target: 'getCachedCursors',
            },
          ],
          FETCH_NEXT_PAGE: {
            cond: 'hasNextPage',
            actions: ['moveCurrentCursorForward'],
            target: 'fetchingNextPage',
          },
        },
      },
      getCachedCursors: {
        tags: ['loading'],
        entry: 'clearError',
        invoke: {
          src: 'getCachedCursors',
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
              actions: ['assignCursors', 'assignInitialCursor'],
              target: 'getAllCursors',
            },
          ],
        },
      },
      getAllCursors: {
        tags: ['loading'],
        entry: 'clearError',
        invoke: {
          src: 'getAllCursors',
          data: (ctx) => {
            return {
              input: {
                address: ctx.walletAddress,
                initialEndCursor: ctx.currentCursor?.endCursor,
              },
            };
          },
          onDone: [
            {
              actions: ['assignGetTransactionHistoryError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignCursors', 'assignInitialCursor'],
              target: 'fetching',
            },
          ],
        },
      },
      fetching: {
        tags: ['loading'],
        entry: 'clearError',
        invoke: {
          src: 'getTransactionHistory',
          data: (ctx) => {
            return {
              input: {
                address: ctx.walletAddress,
                pagination: {
                  after: ctx.currentCursor?.endCursor,
                },
              },
            };
          },
          onDone: [
            {
              actions: ['assignGetTransactionHistoryError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignTransactionHistory'],
              target: 'automaticFetchNextPage',
            },
          ],
        },
      },
      automaticFetchNextPage: {
        tags: ['loading'],
        always: [
          {
            cond: 'shouldFetchMoreAutomatically',
            actions: ['moveCurrentCursorForward'],
            target: 'automaticFetchingNextPage',
          },
          {
            target: 'idle',
          },
        ],
      },
      automaticFetchingNextPage: {
        tags: ['loading'],
        entry: 'clearError',
        invoke: {
          src: 'getTransactionHistory',
          data: (ctx) => {
            return {
              input: {
                address: ctx.walletAddress,
                pagination: {
                  after: ctx.currentCursor?.endCursor,
                },
              },
            };
          },
          onDone: [
            {
              actions: ['assignGetTransactionHistoryError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['appendTransactionHistory'],
              target: 'idle',
            },
          ],
        },
      },
      fetchingNextPage: {
        entry: 'clearError',
        invoke: {
          src: 'getTransactionHistory',
          data: (ctx) => {
            return {
              input: {
                address: ctx.walletAddress,
                pagination: {
                  after: ctx.currentCursor?.endCursor,
                },
              },
            };
          },
          onDone: [
            {
              actions: ['assignGetTransactionHistoryError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['appendTransactionHistory'],
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
      shouldFetchMoreAutomatically: (ctx, _ev) => {
        if (ctx.transactionHistory) {
          const hasCursor = Boolean(ctx.currentCursor?.endCursor);
          const transactionCount = ctx.transactionHistory.length;
          const MINIMUM_TX_COUNT = 7; // Just to fill the screen
          return hasCursor && transactionCount < MINIMUM_TX_COUNT;
        }

        return false;
      },
      hasNextPage: (ctx, _ev) => {
        return Boolean(ctx.currentCursor?.endCursor);
      },
    },
    actions: {
      assignInvalidAddressError: assign({
        error: (_) => TRANSACTION_HISTORY_ERRORS.INVALID_ADDRESS,
      }),
      assignGetTransactionHistoryError: assign({
        error: (_) => TRANSACTION_HISTORY_ERRORS.NOT_FOUND,
      }),
      assignWalletAddress: assign({
        walletAddress: (_, ev) => ev.input.address,
      }),
      assignCursors: assign({
        cursors: (_, ev) => ev.data.cursors,
      }),
      assignInitialCursor: assign({
        currentCursor: (_, ev) => {
          return ev.data.cursors[ev.data.cursors.length - 1];
        },
      }),
      assignTransactionHistory: assign({
        transactionHistory: (_, ev) => ev.data.transactionHistory.reverse(),
      }),
      appendTransactionHistory: assign({
        transactionHistory: (ctx, ev) => {
          const history = ctx.transactionHistory || [];
          return [...history, ...ev.data.transactionHistory.reverse()];
        },
      }),
      moveCurrentCursorForward: assign({
        currentCursor: (ctx, _ev) => {
          const currentCursor = ctx.currentCursor;
          const cursors = ctx.cursors;

          if (!currentCursor) return;

          const currentCursorIndex = cursors.findIndex(
            (c) => c.endCursor === currentCursor.endCursor
          );

          const nextCursor = cursors[currentCursorIndex - 1];

          return nextCursor;
        },
      }),
      clearError: assign({
        error: (_) => undefined,
      }),
    },
    services: {
      getTransactionHistory: FetchMachine.create<
        TxInputs['getTransactionHistory'],
        MachineServices['getTransactionHistory']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('Missing input');
          }

          const { address, pagination } = input;

          const selectedNetwork = await NetworkService.getSelectedNetwork();
          const { transactionHistory } = await TxService.getTransactionHistory({
            address,
            providerUrl: selectedNetwork?.url,
            pagination,
          });
          return { transactionHistory };
        },
      }),
      getCachedCursors: FetchMachine.create<
        TxInputs['getTxCursors'],
        MachineServices['getCachedCursors']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('Missing input');
          }

          const selectedNetwork = await NetworkService.getSelectedNetwork();
          const cursors = await TxService.getTxCursors({
            address: input.address,
            providerUrl: selectedNetwork?.url || '',
          });

          return {
            cursors,
          };
        },
      }),
      getAllCursors: FetchMachine.create<
        TxInputs['getAllCursors'],
        MachineServices['getAllCursors']['data']
      >({
        showError: true,
        async fetch({ input }) {
          if (!input) {
            throw new Error('Missing input');
          }

          const selectedNetwork = await NetworkService.getSelectedNetwork();

          const address = input.address;
          const providerUrl = selectedNetwork?.url || '';
          const initialEndCursor = input.initialEndCursor;
          const result = await TxService.getAllCursors({
            address,
            providerUrl,
            initialEndCursor,
          });
          // Adding missing cursors
          if (result.cursors.length > 0) {
            await TxService.addTxCursors({
              address,
              providerUrl,
              cursors: result.cursors,
            });
          }
          const cursors = await TxService.getTxCursors({
            address,
            providerUrl,
          });

          return {
            cursors,
          };
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
