import type {
  Operation,
  OperationTransactionAddress,
  TransactionResult,
} from 'fuels';
import { isB256 } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { getOperationsWithDomain } from '~/systems/NameSystem/utils/getOperationsWithDomain';
import { type TxInputs, TxService } from '../services';
import type { TransactionCursor, TransactionResultWithDomain } from '../types';

const enrichDomainsAsync = async (
  transactionHistory: TransactionResultWithDomain[]
): Promise<TransactionResultWithDomain[]> => {
  console.debug(
    '[enrichDomainsAsync] Starting enrichment for',
    transactionHistory.length,
    'transactions'
  );

  if (!transactionHistory || transactionHistory.length === 0) {
    console.debug(
      '[enrichDomainsAsync] No transactions to enrich, returning empty array'
    );
    return [];
  }

  try {
    const enriched = await Promise.all(
      transactionHistory.map(async (tx) => {
        try {
          const enrichedOperations = await getOperationsWithDomain(
            tx.operations
          );
          return {
            ...tx,
            operations: enrichedOperations,
          };
        } catch (error) {
          console.debug(
            'Failed to enrich transaction with domain info:',
            error
          );
          return tx;
        }
      })
    );
    console.debug(
      '[enrichDomainsAsync] Enrichment completed for',
      enriched.length,
      'transactions'
    );
    return enriched;
  } catch (error) {
    console.debug('[enrichDomainsAsync] Enrichment failed with error:', error);
    return transactionHistory;
  }
};

const TRANSACTION_HISTORY_ERRORS = {
  INVALID_ADDRESS: 'Invalid address',
  NOT_FOUND: 'Address Transaction history not found',
};

type MachineContext = {
  walletAddress: string;
  error?: string;
  transactionHistory?: TransactionResultWithDomain[];
  currentCursor?: TransactionCursor;
  cursors: TransactionCursor[];
};

type MachineServices = {
  getTransactionHistory: {
    data: {
      transactionHistory: TransactionResultWithDomain[];
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
        entry: () => console.debug('[idle] Entering idle state'),
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
          data: (_, event: MachineEvents) => {
            const ev = event as Extract<
              MachineEvents,
              { type: 'GET_TRANSACTION_HISTORY' }
            >;
            return { input: ev.input };
          },
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
              target: 'enrichingDomains',
            },
          ],
        },
      },
      enrichingDomains: {
        entry: () => console.debug('[enrichingDomains] Entering state'),
        exit: () => console.debug('[enrichingDomains] Exiting state'),
        invoke: {
          src: (ctx) => {
            console.debug('[enrichingDomains] Starting enrichment invoke');
            return enrichDomainsAsync(ctx.transactionHistory || []);
          },
          onDone: {
            actions: assign({
              transactionHistory: (_, ev) => {
                console.debug(
                  '[enrichingDomains] onDone action, updating transaction history'
                );
                return ev.data as TransactionResultWithDomain[];
              },
            }),
            target: 'automaticFetchNextPage',
          },
          onError: {
            actions: () =>
              console.debug('[enrichingDomains] onError - enrichment failed'),
            target: 'automaticFetchNextPage',
          },
        },
      },
      automaticFetchNextPage: {
        tags: ['loading'],
        entry: () =>
          console.debug(
            '[automaticFetchNextPage] Checking if should fetch more automatically'
          ),
        always: [
          {
            cond: 'shouldFetchMoreAutomatically',
            actions: ['moveCurrentCursorForward'],
            target: 'automaticFetchingNextPage',
          },
          {
            actions: () =>
              console.debug(
                '[automaticFetchNextPage] No more auto-fetch needed, transitioning to idle'
              ),
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
              target: 'enrichingDomainsAfterAppend',
            },
          ],
        },
      },
      enrichingDomainsAfterAppend: {
        entry: () =>
          console.debug('[enrichingDomainsAfterAppend] Entering state'),
        exit: () =>
          console.debug('[enrichingDomainsAfterAppend] Exiting state'),
        invoke: {
          src: (ctx) => {
            console.debug(
              '[enrichingDomainsAfterAppend] Starting enrichment invoke'
            );
            return enrichDomainsAsync(ctx.transactionHistory || []);
          },
          onDone: {
            actions: assign({
              transactionHistory: (_, ev) => {
                console.debug(
                  '[enrichingDomainsAfterAppend] onDone action, updating transaction history'
                );
                return ev.data as TransactionResultWithDomain[];
              },
            }),
            target: 'idle',
          },
          onError: {
            actions: () =>
              console.debug(
                '[enrichingDomainsAfterAppend] onError - enrichment failed'
              ),
            target: 'idle',
          },
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
              target: 'enrichingDomainsAfterAppend',
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      isInvalidAddress: (_, ev) => {
        return !isB256(ev.input?.address);
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
