import { isB256 } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { type TxInputs, TxService } from '../services';
import type { TransactionResultWithDomain } from '../types';
import { enrichDomains } from '../utils/enrichDomains';

const TRANSACTION_HISTORY_ERRORS = {
  INVALID_ADDRESS: 'Invalid address',
  NOT_FOUND: 'Address Transaction history not found',
};

type MachineContext = {
  walletAddress: string;
  error?: string;
  transactionHistory?: TransactionResultWithDomain[];
  endCursor?: string | null;
  hasNextPage: boolean;
};

type MachineServices = {
  getTransactionHistory: {
    data: {
      transactionHistory: TransactionResultWithDomain[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string | null;
      };
    };
  };
  enrichDomains: {
    data: TransactionResultWithDomain[];
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
    context: {
      walletAddress: '',
      hasNextPage: false,
    },
    states: {
      idle: {
        on: {
          GET_TRANSACTION_HISTORY: [
            {
              cond: 'isInvalidAddress',
              actions: 'assignInvalidAddressError',
            },
            {
              actions: ['assignWalletAddress', 'resetPagination'],
              target: 'fetching',
            },
          ],
          FETCH_NEXT_PAGE: {
            cond: 'hasNextPage',
            target: 'fetchingNextPage',
          },
        },
      },
      fetching: {
        tags: ['loading'],
        entry: 'clearError',
        invoke: {
          src: 'getTransactionHistory',
          data: (ctx) => ({
            input: {
              address: ctx.walletAddress,
            },
          }),
          onDone: [
            {
              actions: ['assignGetTransactionHistoryError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['assignTransactionHistory', 'assignPageInfo'],
              target: 'enrichingDomains',
            },
          ],
        },
      },
      fetchingNextPage: {
        entry: 'clearError',
        invoke: {
          src: 'getTransactionHistory',
          data: (ctx) => ({
            input: {
              address: ctx.walletAddress,
              pagination: {
                before: ctx.endCursor,
              },
            },
          }),
          onDone: [
            {
              actions: ['assignGetTransactionHistoryError'],
              target: 'idle',
              cond: FetchMachine.hasError,
            },
            {
              actions: ['appendTransactionHistory', 'assignPageInfo'],
              target: 'enrichingDomains',
            },
          ],
        },
      },
      enrichingDomains: {
        invoke: {
          src: 'enrichDomains',
          onDone: {
            actions: 'assignEnrichedHistory',
            target: 'idle',
          },
          onError: {
            target: 'idle',
          },
        },
      },
    },
  },
  {
    guards: {
      isInvalidAddress: (_, ev) => {
        return !isB256(ev.input?.address);
      },
      hasNextPage: (ctx) => {
        return ctx.hasNextPage && Boolean(ctx.endCursor);
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
      resetPagination: assign({
        endCursor: (_) => undefined,
        hasNextPage: (_) => false,
      }),
      assignPageInfo: assign({
        endCursor: (_, ev) => ev.data.pageInfo.endCursor,
        hasNextPage: (_, ev) => ev.data.pageInfo.hasNextPage,
      }),
      assignTransactionHistory: assign({
        transactionHistory: (_, ev) => ev.data.transactionHistory,
      }),
      appendTransactionHistory: assign({
        transactionHistory: (ctx, ev) => {
          const history = ctx.transactionHistory || [];
          return [...history, ...ev.data.transactionHistory];
        },
      }),
      assignEnrichedHistory: assign({
        transactionHistory: (_, ev) => ev.data,
      }),
      clearError: assign({
        error: (_) => undefined,
      }),
    },
    services: {
      enrichDomains: (ctx) => enrichDomains(ctx.transactionHistory || []),
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
          const { transactionHistory, pageInfo } =
            await TxService.getTransactionHistory({
              address,
              providerUrl: selectedNetwork?.url,
              pagination,
            });

          return {
            transactionHistory,
            pageInfo: {
              hasNextPage: pageInfo.hasNextPage,
              endCursor: pageInfo.endCursor,
            },
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
