import type { Account, AccountWithBalance } from '@fuel-wallet/types';
import { bn } from 'fuels';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { CONSOLIDATION_CHECKED_KEY, IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import { CoreService, FetchMachine, Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { AccountService } from '../services/account';
import type { AccountInputs } from '../services/account';

type MachineContext = {
  accounts?: Account[];
  needsRecovery?: boolean;
  account?: AccountWithBalance;
  balancesKey?: string;
  error?: unknown;
  isFetchingAccounts?: boolean;
  isLoggingOut?: boolean;
  skipLoading?: boolean;
};

type FetchAccountResult = {
  account: AccountWithBalance;
  balancesKey: string;
};

type MachineServices = {
  fetchAccounts: {
    data: {
      accounts: Account[];
      needsRecovery: boolean;
    };
  };
  fetchAccount: {
    data: FetchAccountResult | undefined;
  };
  setCurrentAccount: {
    data: Account;
  };
};

export type AccountsMachineEvents =
  | { type: 'REFRESH_ACCOUNTS'; input?: { skipLoading?: boolean } }
  | { type: 'SET_CURRENT_ACCOUNT'; input: AccountInputs['setCurrentAccount'] }
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  | { type: 'LOGOUT'; input?: void }
  | {
      type: 'TOGGLE_HIDE_ACCOUNT';
      input: AccountInputs['updateAccount'];
    };

function stringifyBigInts(_key: string, value: unknown) {
  return typeof value === 'bigint' ? value.toString() : value;
}

// Keeps the previous reference when data is unchanged, so selectors can use identity checks
function keepIfEqual<T>(prev: T, next: T): T {
  if (prev === next) return prev;
  if (
    prev &&
    next &&
    JSON.stringify(prev, stringifyBigInts) ===
      JSON.stringify(next, stringifyBigInts)
  ) {
    return prev;
  }
  return next;
}

// Consolidation need only changes with the network, the account or its coins
function getBalancesKey(providerUrl: string, account: AccountWithBalance) {
  const balances = (account.balances ?? []).map(
    (balance) => `${balance.assetId}:${bn(balance.amount).toString()}`
  );
  return [providerUrl, account.address, ...balances].join('|');
}

const fetchingAccountsState = {
  initial: 'fetchingAccounts',
  entry: 'assignIsFetching',
  exit: 'assignIsntFetching',
  states: {
    fetchingAccounts: {
      invoke: {
        src: 'fetchAccounts',
        onDone: [
          {
            actions: 'assignError',
            target: '#(machine).failed',
            cond: FetchMachine.hasError,
          },
          {
            target: 'recoveringWallet',
            actions: ['assignAccounts'],
            cond: 'needsRecovery',
          },
          {
            target: 'fetchingAccount',
            actions: ['assignAccounts'],
          },
        ],
      },
    },
    recoveringWallet: {
      invoke: {
        src: 'recoverWallet',
        onDone: [
          {
            actions: 'assignError',
            target: '#(machine).failed',
            cond: FetchMachine.hasError,
          },
          {
            target: 'fetchingAccount',
          },
        ],
      },
    },
    fetchingAccount: {
      invoke: {
        src: 'fetchAccount',
        onDone: [
          {
            cond: FetchMachine.hasError,
            actions: 'assignError',
            target: '#(machine).failed',
          },
          {
            target: '#(machine).idle',
            actions: [
              'assignAccount',
              'assignSkipLoadingTrue',
              'notifyBalancesChanged',
              'assignBalancesKey',
            ],
          },
        ],
      },
    },
  },
};

export const accountsMachine = createMachine(
  {
    tsTypes: {} as import('./accountsMachine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      services: {} as MachineServices,
      events: {} as AccountsMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'checkStartFetching',
    states: {
      idle: {
        after: {
          REFRESH_INTERVAL: [
            {
              cond: 'isDocumentVisible',
              target: 'checkStartFetching',
            },
            {
              target: 'idle',
            },
          ],
        },
      },
      checkStartFetching: {
        always: [
          {
            cond: 'isLoggingOut',
            target: 'idle',
          },
          {
            cond: 'shouldSkipLoading',
            target: 'refreshingAccounts',
          },
          {
            target: 'fetchingAccounts',
          },
        ],
      },
      fetchingAccounts: {
        tags: ['loading'],
        ...fetchingAccountsState,
      },
      refreshingAccounts: {
        ...fetchingAccountsState,
      },
      settingCurrentAccount: {
        invoke: {
          src: 'setCurrentAccount',
          data: {
            input: (_: MachineContext, ev: AccountsMachineEvents) => ev.input,
          },
          onDone: [
            {
              actions: 'assignError',
              target: 'failed',
              cond: FetchMachine.hasError,
            },
            {
              actions: [
                'notifyUpdateAccounts',
                'redirectToHome',
                'assignSkipLoadingFalse',
              ],
              target: 'checkStartFetching',
            },
          ],
        },
      },
      checkLogout: {
        // this state enters on a "lock" state where fetching will not be performed
        // also it will wait til fetching is not happening anymore
        tags: ['loading'],
        entry: 'assignIsLoggingOut',
        always: [
          {
            cond: 'isntFetchingAccounts',
            target: 'loggingout',
          },
        ],
        after: {
          LOOP_TRY_LOGOUT: {
            target: 'checkLogout',
          },
        },
      },
      loggingout: {
        tags: ['loading'],
        invoke: {
          src: 'logout',
          onDone: [
            {
              cond: FetchMachine.hasError,
              actions: 'assignError',
              target: 'failed',
            },
            {
              actions: ['clearContext'],
              target: 'stopAll',
            },
          ],
        },
      },
      stopAll: {
        type: 'final',
      },
      failed: {
        after: {
          INTERVAL: [
            {
              target: 'checkStartFetching', // retry
            },
            {
              target: 'idle',
            },
          ],
        },
      },
    },
    on: {
      LOGOUT: {
        target: 'checkLogout',
      },
      SET_CURRENT_ACCOUNT: {
        target: 'settingCurrentAccount',
      },
      TOGGLE_HIDE_ACCOUNT: {
        actions: ['toggleHideAccount', 'notifyUpdateAccounts'],
      },
      REFRESH_ACCOUNTS: [
        {
          actions: ['assignSkipLoading'],
          target: 'checkStartFetching',
        },
      ],
    },
  },
  {
    delays: {
      INTERVAL: 2000,
      REFRESH_INTERVAL: 20000,
      LOOP_TRY_LOGOUT: 100,
    },
    actions: {
      assignAccounts: assign({
        accounts: (ctx, ev) => keepIfEqual(ctx.accounts, ev.data.accounts),
        needsRecovery: (_, ev) => ev.data.needsRecovery,
      }),
      assignAccount: assign({
        account: (ctx, ev) => keepIfEqual(ctx.account, ev.data?.account),
      }),
      assignBalancesKey: assign({
        balancesKey: (_, ev) => ev.data?.balancesKey,
      }),
      notifyBalancesChanged: (ctx, ev) => {
        const balancesKey = ev.data?.balancesKey;
        if (!balancesKey || balancesKey === ctx.balancesKey) return;
        // A previous popup already found no consolidation need for these balances
        if (
          !ctx.balancesKey &&
          balancesKey === Storage.getItem(CONSOLIDATION_CHECKED_KEY)
        ) {
          return;
        }
        store.refreshConsolidateCoins({ balancesKey });
      },
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      clearContext: assign(() => ({})),
      toggleHideAccount: (_, ev) => {
        AccountService.updateAccount(ev.input);
      },
      notifyUpdateAccounts: () => {
        store.refreshAccounts();
      },
      redirectToHome: () => {
        store.closeOverlay();
      },
      assignIsFetching: assign({
        isFetchingAccounts: () => true,
      }),
      assignIsntFetching: assign({
        isFetchingAccounts: () => false,
      }),
      assignIsLoggingOut: assign({
        isLoggingOut: () => true,
      }),
      assignSkipLoading: assign({
        skipLoading: (_, ev) => !!ev.input?.skipLoading,
      }),
      assignSkipLoadingTrue: assign({
        skipLoading: () => true,
      }),
      assignSkipLoadingFalse: assign({
        skipLoading: () => false,
      }),
    },
    services: {
      fetchAccounts: FetchMachine.create<
        never,
        { accounts: Account[]; needsRecovery: boolean }
      >({
        showError: true,
        async fetch() {
          const accounts = await AccountService.getAccounts();
          const { needsRecovery } = await AccountService.fetchRecoveryState();

          return {
            accounts,
            needsRecovery,
          };
        },
      }),
      recoverWallet: FetchMachine.create<never, void>({
        async fetch() {
          await AccountService.recoverWallet();
        },
      }),
      fetchAccount: FetchMachine.create<never, FetchAccountResult | undefined>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          let accountToFetch = await AccountService.getCurrentAccount();
          if (!accountToFetch) {
            await AccountService.setCurrentAccountToDefault();
            accountToFetch = await AccountService.getCurrentAccount();
          }
          if (!accountToFetch) return undefined;

          const selectedNetwork = await NetworkService.getSelectedNetwork();
          if (!selectedNetwork) return undefined;

          const providerUrl = selectedNetwork.url;
          const accountWithBalance = await AccountService.fetchBalance({
            account: accountToFetch,
            providerUrl,
          });

          return {
            account: accountWithBalance,
            balancesKey: getBalancesKey(providerUrl, accountWithBalance),
          };
        },
      }),
      setCurrentAccount: FetchMachine.create<
        AccountInputs['setCurrentAccount'],
        Account
      >({
        maxAttempts: 1,
        async fetch({ input }) {
          if (!input?.address) {
            throw new Error('Invalid account address');
          }
          const account = await AccountService.setCurrentAccount(input);
          if (!account) {
            throw new Error('Failed to select account');
          }
          return account;
        },
      }),
      logout: FetchMachine.create<never, void>({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          await CoreService.clear();
        },
      }),
    },
    guards: {
      needsRecovery: (_, ev) => {
        return Boolean(ev.data.needsRecovery);
      },
      isDocumentVisible: () => {
        return (
          typeof document === 'undefined' ||
          document.visibilityState === 'visible'
        );
      },
      shouldSkipLoading: (ctx) => {
        return !!ctx.skipLoading;
      },
      isLoggingOut: (ctx) => {
        return !!ctx.isLoggingOut;
      },
      isntFetchingAccounts: (ctx) => {
        return !ctx.isFetchingAccounts;
      },
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineService = InterpreterFrom<AccountsMachine>;
export type AccountsMachineState = StateFrom<AccountsMachine>;
