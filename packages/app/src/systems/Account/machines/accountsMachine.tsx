import type { Account, AccountWithBalance } from '@fuel-wallet/types';
import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';
import { IS_LOGGED_KEY } from '~/config';
import { store } from '~/store';
import { CoreService, FetchMachine, Storage } from '~/systems/Core';
import { NetworkService } from '~/systems/Network';

import { AccountService } from '../services/account';
import type { AccountInputs } from '../services/account';

type MachineContext = {
  accounts?: Account[];
  needsRecovery?: boolean;
  account?: AccountWithBalance;
  error?: unknown;
};

type MachineServices = {
  fetchAccounts: {
    data: {
      accounts: Account[];
      needsRecovery: boolean;
    };
  };
  fetchAccount: {
    data: AccountWithBalance;
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

const fetchingAccountsState = 
{
  initial: 'fetchingAccounts',
  states: {
    fetchingAccounts: {
      invoke: {
        src: 'fetchAccounts',
        onDone: [
        {
          target: 'recoveringWallet',
          actions: ['assignAccounts', 'setIsLogged'],
          cond: 'hasAccountsOrNeedsRecovery',
        },
        {
          target: 'fetchingAccount',
          actions: ['assignAccounts'],
        },
      ],
      onError: [
        {
          actions: 'assignError',
          target: '#(machine).failed',
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
            actions: ['assignAccount'],
          },
        ],
        onError: [
          {
            actions: 'assignError',
            target: '#(machine).failed',
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
    initial: 'fetchingAccounts',
    states: {
      idle: {
        on: {
          SET_CURRENT_ACCOUNT: {
            target: 'settingCurrentAccount',
          },
          TOGGLE_HIDE_ACCOUNT: {
            actions: ['toggleHideAccount', 'notifyUpdateAccounts'],
            target: 'idle',
          },
        },
        after: {
          /**
           * Update accounts every 5 seconds
           */
          TIMEOUT: {
            target: 'refreshingAccounts',
            cond: 'isLoggedIn',
          },
        },
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
              actions: ['notifyUpdateAccounts', 'redirectToHome'],
              target: 'fetchingAccounts',
            },
          ],
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
              actions: ['clearContext', 'refreshApplication'],
              target: 'idle',
            },
          ],
        },
      },
      failed: {
        after: {
          INTERVAL: {
            target: 'fetchingAccounts', // retry
            cond: 'isLoggedIn',
          },
        },
      },
    },
    on: {
      LOGOUT: {
        target: 'loggingout',
      },
      REFRESH_ACCOUNTS: [
        {
          cond: 'shouldSkipLoading',
          target: 'refreshingAccounts',
        },
        {
          target: 'fetchingAccounts',
        }
      ],
    },
  },
  {
    delays: {
      INTERVAL: 2000,
      TIMEOUT: 5000,
    },
    actions: {
      assignAccounts: assign({
        accounts: (_, ev) => ev.data.accounts,
        needsRecovery: (_, ev) => ev.data.needsRecovery,
      }),
      assignAccount: assign({
        account: (_, ev) => ev.data,
      }),
      assignError: assign({
        error: (_, ev) => ev.data,
      }),
      clearContext: assign(() => ({})),
      toggleHideAccount: (_, ev) => {
        AccountService.updateAccount(ev.input);
      },
      setIsLogged: () => {
        Storage.setItem(IS_LOGGED_KEY, true);
      },
      notifyUpdateAccounts: () => {
        store.refreshAccounts();
      },
      redirectToHome: () => {
        store.closeOverlay();
      }
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
      fetchAccount: FetchMachine.create<never, AccountWithBalance | undefined>({
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

          return accountWithBalance;
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
      isLoggedIn: () => {
        return !!Storage.getItem(IS_LOGGED_KEY);
      },
      hasAccountsOrNeedsRecovery: (ctx, ev) => {
        const hasAccounts = Boolean(
          (ev.data.accounts || ctx?.accounts || []).length
        );
        const needsRecovery = Boolean(
          ev.data.needsRecovery || ctx?.needsRecovery
        );
        return hasAccounts || needsRecovery;
      },
      shouldSkipLoading: (_, ev) => {
        return !!ev.input?.skipLoading;
      },
    },
  }
);

export type AccountsMachine = typeof accountsMachine;
export type AccountsMachineService = InterpreterFrom<AccountsMachine>;
export type AccountsMachineState = StateFrom<AccountsMachine>;
