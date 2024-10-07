import type { TransactionResult } from 'fuels';
import { isB256, isBech32 } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { FetchMachine } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { type TxInputs, TxService } from '../services';

const TRANSACTION_HISTORY_ERRORS = {
  INVALID_ADDRESS: 'Invalid address',
  NOT_FOUND: 'Address Transaction history not found',
};

export const TX_PER_PAGE = 20;

type MachineContext = {
  walletAddress: string;
  error?: string;
  transactionHistory?: TransactionResult[];
  pageInfo?: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
};

type MachineServices = {
  getTransactionHistory: {
    data: {
      transactionHistory: TransactionResult[];
      pageInfo: MachineContext['pageInfo'];
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

/**
 * @TODO: Once we get the pagination backwards working,
 * we need to replace `first` with `last` and `after` with `before`
 * and `hasNextPage` with `hasPreviousPage`
 * and maybe remove the reverse() calls
 */
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
              actions: ['assignTransactionHistory', 'assignPageInfo'],
              target: 'idle',
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
                first: TX_PER_PAGE,
                after: ctx.pageInfo?.endCursor,
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
      hasNextPage: (ctx, _ev) => {
        return ctx.pageInfo?.hasNextPage ?? false;
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
      assignTransactionHistory: assign({
        transactionHistory: (_, ev) => ev.data.transactionHistory.reverse(),
      }),
      assignPageInfo: assign({
        pageInfo: (_, ev) => ev.data.pageInfo,
      }),
      appendTransactionHistory: assign({
        transactionHistory: (ctx, ev) => {
          const history = ctx.transactionHistory || [];
          return [...history, ...ev.data.transactionHistory.reverse()];
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
          const address = input?.address;
          const selectedNetwork = await NetworkService.getSelectedNetwork();
          const result = await TxService.getTransactionHistory({
            address: address?.toString() || '',
            providerUrl: selectedNetwork?.url,
            pagination: input?.pagination,
          });
          return result;
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
